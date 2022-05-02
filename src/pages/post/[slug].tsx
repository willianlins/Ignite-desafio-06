/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BiTimeFive } from 'react-icons/bi';
import Primisc from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { parse } from 'node-html-parser';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  let totalTexto: string;
  let arrayPalavras: string[];
  const router = useRouter();

  const tempoLeitura = post.data.content.reduce((ac, element) => {
    totalTexto += `${element.heading} ${parse(
      String(RichText.asText(element.body))
    )}`;

    arrayPalavras = totalTexto.split(/\s/);

    return ac + Math.round(arrayPalavras.length / 200);
  }, 0);

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <img className={styles.img} src={post.data.banner.url} alt="" />
      <main className={styles.container}>
        <article className={styles.content}>
          <div>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <AiOutlineCalendar />
              <span>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </span>
              <IoPersonOutline />
              <span>{post.data.author}</span>
              <BiTimeFive />
              <span>{tempoLeitura + 1} min</span>
            </div>
          </div>

          {post.data.content.map(el => (
            <div key={String(el.heading)}>
              <h2>{String(el.heading)}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: String(RichText.asHtml(el.body)),
                }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Primisc.predicates.at('document.type', 'post')],
    {
      fetch: ['post.slug'],
      pageSize: 100,
    }
  );

  const paths = posts.results.map(post => {
    return {
      params: { slug: post.uid },
    };
  });

  return {
    paths,
    fallback: 'true',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient(params.req);
  const response = await prismic.getByUID('post', String(slug), {});
  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(element => {
        return {
          heading: element.heading,
          body: element.body,
        };
      }),
    },
  };
  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 5, // 5hours
  };
};
