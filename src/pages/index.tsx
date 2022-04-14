/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
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
export default function Home() {
  return (
    <>
      <Head>Home | spacetraveling</Head>
      <main className={styles.container}>
        <div className={styles.content}>
          <ul>
            <li>
              <a href="http://localhost:3000/">
                <section>
                  <h1>Como utilizar Hooks</h1>
                  <p>
                    Pensando em sincronização em vez de ciclos de vida.Pensando
                    em sincronização em vez de ciclos de vida Pensando em
                    sincronização em vez de ciclos de vida Pensando em
                    sincronização em vez de ciclos de vida Pensando em
                    sincronização em vez de ciclos de vida Pensando em
                    sincronização em vez de ciclos de vida Pensando em
                  </p>
                </section>
              </a>
              <div>
                <AiOutlineCalendar />
                <span>15 Mar 2021</span>
                <IoPersonOutline />
                <span>Joseph Oliveira</span>
              </div>
            </li>
            <li>
              <a href="http://localhost:3000/">
                <section>
                  <h1>Como utilizar Hooks</h1>
                  <p>Pensando em sincronização em vez de ciclos de vida.</p>
                </section>
              </a>
              <div>
                <AiOutlineCalendar />
                <span>15 Mar 2021</span>
                <IoPersonOutline />
                <span>Joseph Oliveira</span>
              </div>
            </li>
            <li>
              <a href="http://localhost:3000/">
                <section>
                  <h1>Como utilizar Hooks</h1>
                  <p>Pensando em sincronização em vez de ciclos de vida.</p>
                </section>
              </a>
              <div>
                <AiOutlineCalendar />
                <span>15 Mar 2021</span>
                <IoPersonOutline />
                <span>Joseph Oliveira</span>
              </div>
            </li>
            <li>
              <a href="http://localhost:3000/">
                <section>
                  <h1>Como utilizar Hooks</h1>
                  <p>Pensando em sincronização em vez de ciclos de vida.</p>
                </section>
              </a>
              <div>
                <AiOutlineCalendar />
                <span>15 Mar 2021</span>
                <IoPersonOutline />
                <span>Joseph Oliveira</span>
              </div>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };
