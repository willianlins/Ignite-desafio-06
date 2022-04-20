/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { AiOutlineCalendar } from 'react-icons/ai';
import { IoPersonOutline } from 'react-icons/io5';
import { BiTimeFive } from 'react-icons/bi';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
  return (
    <>
      <Head> | spacetraveling</Head>

      <img src="/Banner.png" alt="" />
      <main className={styles.container}>
        <article className={styles.content}>
          <div>
            <h1>
              Prisma: uma das melhores coisas que já aconteceu no ecossistema?
            </h1>
            <div className={styles.postInfo}>
              <AiOutlineCalendar />
              <span>15 Mar 2021</span>
              <IoPersonOutline />
              <span>Joseph Oliveira</span>
              <BiTimeFive />
              <span>4 min</span>
            </div>
          </div>
          <p>
            <h2>Um breve arquivo</h2> sobre a origem da ferramenta que facilitou
            o acesso de databases e ampliou produtividade para o ecossistema
            JavaScript/TypeScript
          </p>
          <p>
            Dividido em três camadas como núcleo de sua arquitetura, o Prisma
            nasceu no ecossistema JavaScript com a promessa de ser uma
            ferramenta facilitadora e produtiva para devs que trabalham
            diretamente com databases. Por uma série de razões, a tecnologia
            chegou a ser reconhecida como “uma das melhores coisas que já
            aconteceu” na programação backend entre usuários de Node.js. O
            artigo desta semana pretende levantar um arquivo sobre o Prisma e
            entender os motivos da tecnologia ter obtido tanta relevância ao
            longo desses anos. Se você acompanha nossa plataforma e acessou
            recentemente nossos conteúdos no YouTube, já deve ter reparado que
            estamos de olho na performance do Prisma há bastante tempo. Não há
            exatamente uma data para apontar como “o dia em que foi lançado”, no
            entanto, se entrarmos nos registros do GitHub, reparamos que os
            primeiros repositórios do Prisma surgiram em meados de 2017, com
            assinaturas de Lukáš Huvar e Johannes Schickling. Antes de ser
            Prisma, o pequeno projeto era chamado de Graphcool e contava com uma
            equipe pequena de cinco devs que pretendiam desenvolver uma solução
            como backend-as-a-service para GraphQL. O Graphcool na época foi bem
            recebido pela comunidade, principalmente por ser “fácil de usar” até
            para devs Frontend. Nikolas Burk, um dos primeiros devs da equipe,
            reconheceu nesta thread que, apesar do projeto ter potencial na
            época, não conseguiu escalar por conta da falta de flexibilidade. A
            solução foi desenvolver, ao longo de uma série de tentativas, o
            Prisma 1.0, em 2018. O Prisma Client foi anunciado meses depois. A
            tecnologia atualmente se encontra em sua terceira etapa de
            desenvolvimento, chamada de Prisma 3, uma versão com recursos mais
            avançados e consistentes. Apesar do nome numérico, o produto oficial
            do Prisma, que engloba todos os serviços da tecnologia, está no
            Prisma Client e Studio, este último lançado em novembro de 2019.
          </p>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);
  return {
    paths: [],
    fallback: 'blocking',
  };
  // TODO
};

export const getStaticProps = async ({ req, params }) => {
  const { slug } = params;
  const prismic = getPrismicClient(req);
  const response = await prismic.getByUID('post', String(slug), {});
  // console.log(response.data.content);
  const posts = {
    first_publication_date: format(
      new Date(response.last_publication_date),
      'dd MMMM yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: response.data.title,
      banner: response.data.banner.url,
      author: response.data.author,
      content: response.data.content.map(element => {
        return {
          heading: element.heading.text,
          body: element.body,
        };
      }),
      // [response.data.content.body.text],
    },
  };

  // first_publication_date: string | null;
  // data: {
  //   title: string;
  //   banner: {
  //     url: string;
  //   };
  //   author: string;
  //   content: {
  //     heading: string;
  //     body: {
  //       text: string;
  //     }[];
  //   }[];
  // };

  console.log(posts.data.content.content);
  return {
    props: {},
  };
};
