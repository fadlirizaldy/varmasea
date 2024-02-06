import AuthLayout from "@/components/Layout/AuthLayout";
import MainLayoutAdmin from "@/components/Layout/MainLayoutAdmin";
import MainLayoutUser from "@/components/Layout/MainLayoutUser";
import "@/styles/globals.css";
import "@/styles/styleSlider.css";
import { GCP_PUBLIC_IMG } from "@/utils/api/apiURL";
import { NextComponentType, NextPageContext } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { Toaster } from "sonner";

type AppCustomProps = {
  Component: NextComponentType<NextPageContext, any, any> & { title: string };
  pageProps: any;
};

export default function App({ Component, pageProps }: AppCustomProps) {
  // return <Component {...pageProps} />;
  const router = useRouter();
  let OutputComponent: JSX.Element;
  // return (
  //   <AuthLayout>
  //     <Component {...pageProps} />
  //   </AuthLayout>
  // );
  if (router.pathname.includes("/auth")) {
    OutputComponent = (
      <AuthLayout>
        <Component {...pageProps} />
      </AuthLayout>
    );
  } else if (router.pathname.includes("/admin")) {
    OutputComponent = (
      <MainLayoutAdmin>
        <Component {...pageProps} />
      </MainLayoutAdmin>
    );
  } else {
    OutputComponent = (
      <MainLayoutUser>
        <Component {...pageProps} />
      </MainLayoutUser>
    );
  }
  return (
    <>
      <Head>
        <title>{Component.title}</title>
        <link rel="shortcut icon" href={`${GCP_PUBLIC_IMG}/icon_logo.png`} />
      </Head>
      <Toaster position="bottom-right" richColors toastOptions={{ duration: 2500 }} />
      {OutputComponent}
    </>
  );
}
