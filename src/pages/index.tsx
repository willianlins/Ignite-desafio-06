/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import Link from 'next/link';
import Prismic from '@prismicio/client';
// import { RichText } from 'prismic-dom';

// import commonStyles from '../styles/common.module.scss';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>Home | spacetraveling</Head>
      <main className={styles.container}>
        <div className={styles.content}>
          <ul>
            {postsPagination?.results.map(post => (
              <li key={post.uid}>
                <Link href={`/post/${post.uid}`}>
                  <a>
                    <section>
                      <h1>{post.data.title}</h1>
                      <p>{post.data.subtitle}</p>
                    </section>
                  </a>
                </Link>
                <div>
                  <AiOutlineCalendar />
                  <span>{post.first_publication_date}</span>
                  <IoPersonOutline />
                  <span>{post.data.author}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.slug', 'post.title', 'post.author', 'post.subtitle'],
      pageSize: 100,
    }
  );

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: format(
        new Date(post.last_publication_date),
        'dd MMMM yyyy',
        {
          locale: ptBR,
        }
      ),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: '',
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
