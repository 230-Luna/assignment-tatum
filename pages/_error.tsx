import { NextPageContext } from "next";

export default function ErrorPage({
  statusCode,
  error,
}: {
  statusCode: number;
  error: Error;
}) {
  if (statusCode === 404) {
    return <NotFoundErrorPage />;
  }

  if (statusCode === 500) {
    return <ServerErrorPage />;
  }

  return <DefaultErrorPage error={error} />;

  function NotFoundErrorPage() {
    return (
      <>
        <div>페이지를 찾을 수 없어요</div>
      </>
    );
  }

  function ServerErrorPage() {
    return (
      <>
        <div>서버에 문제가 있어요</div>
      </>
    );
  }

  function DefaultErrorPage({ error }: { error?: Error }) {
    console.error(error?.message);
    return (
      <>
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">알 수 없는 문제가 발생했어요</h1>
        </div>
      </>
    );
  }
}
ErrorPage.getInitialProps = (ctx: NextPageContext) => {
  const { res, err: error } = ctx;
  const statusCode = res ? res.statusCode : error ? error.statusCode : 404;
  return { statusCode, error };
};
