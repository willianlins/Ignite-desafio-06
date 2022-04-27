/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BiTimeFive } from 'react-icons/bi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import { parse } from 'node-html-parser';
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

  const tempoLeitura = post.data.content.reduce((ac, element) => {
    totalTexto += `${element.heading} ${parse(String(element.body))}`;

    arrayPalavras = totalTexto.split(/\s/);

    return ac + Math.ceil(arrayPalavras.length / 200);
  }, 0);

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
              <span>{post.first_publication_date}</span>
              <IoPersonOutline />
              <span>{post.data.author}</span>
              <BiTimeFive />
              <span>{tempoLeitura} min</span>
            </div>
          </div>

          {post.data.content.map(el => (
            <div key={el.heading}>
              <h2>{el.heading}</h2>
              <div dangerouslySetInnerHTML={{ __html: String(el.body) }} />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking',
  };
  // TODO
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient(params.req);
  const response = await prismic.getByUID('post', String(slug), {});
  const post = {
    first_publication_date: format(
      new Date(response.last_publication_date),
      'dd MMMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(element => {
        return {
          heading: RichText.asText(element.heading),
          body: RichText.asHtml(element.body),
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
