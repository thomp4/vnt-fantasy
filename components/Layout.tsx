import Head from 'next/head'
import React from 'react'
import clsx from 'clsx'

interface Props {
  title?: string
  description?: string
  image?: string
}

const Layout: React.FC<Props> = (props) => {
  return (
    <>
      <Head>
        <title>{props.title || 'Fantasy premier league'}</title>
        <meta name="description" content={props.description} />
        <meta property="og:title" content={props.title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={props.image} />
        <meta property="og:description" content={props.description} />
      </Head>
      {/*<div className="m-auto px-0 lg:px-[32px] 2xl:px-[80px] 2xl:max-w-[1512px]">*/}
      <div
        className={clsx(
          'm-auto',
          'px-0',
          'md:px-[32px]',
          'lg:px-[48px]',
          'xl:px-[72px] xl:max-w-[1280px]',
          '2xl:px-[152px] 2xl:max-w-[1536px]'
        )}
      >
        {props.children}
      </div>
    </>
  )
}

export default Layout
