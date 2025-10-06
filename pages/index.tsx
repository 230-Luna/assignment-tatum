import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/users/cloud-management",
      permanent: false,
    },
  };
};

export default function Home() {
  return null;
}
