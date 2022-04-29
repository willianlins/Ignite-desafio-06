import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useEffect, useState } from 'react';
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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<PostPagination>();

  useEffect(() => {
    setPosts(postsPagination);
  }, []);

  function nextPagesPosts(): void {
    const nextPostAutx = posts.next_page;
    fetch(nextPostAutx)
      .then(response => response.json())
      .then(data => {
        const tst = data?.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: {
              title: post.data.title,
              subtitle: post.data.subtitle,
              author: post.data.author,
            },
          };
        });

        const base = {
          next_page: data?.next_page,
          results: posts.results.concat(tst),
        };
        setPosts(base);
      });
  }

  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.content}>
          <ul>
            {posts?.results.map(post => (
              <li key={post?.uid}>
                <Link href={`/post/${post?.uid}`}>
                  <a>
                    <section>
                      <h1>{post?.data.title}</h1>
                      <p>{post?.data.subtitle}</p>
                    </section>
                  </a>
                </Link>
                <div>
                  <AiOutlineCalendar />
                  <span>
                    {format(
                      new Date(post.first_publication_date),
                      'dd MMM yyyy',
                      {
                        locale: ptBR,
                      }
                    )}
                  </span>
                  <IoPersonOutline />
                  <span>{post?.data.author}</span>
                </div>
              </li>
            ))}
          </ul>
          {posts?.next_page && (
            <button
              type="button"
              className={styles.MaisPosts}
              onClick={() => nextPagesPosts()}
            >
              Carregar mais posts
            </button>
          )}
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
      pageSize: 2,
    }
  );

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  const postsPagination = {
    next_page: response.next_page,
    results: posts,
  };

  return {
    props: {
      postsPagination,
    },
  };
};
