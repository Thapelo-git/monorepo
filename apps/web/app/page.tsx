"use client";
import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import supabase from "../src/lib/supabase"
import styles from "./page.module.css";
import { useEffect,useState } from "react";
type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {

const [fetchError, setFetchError] = useState<string | null>(null);
const [tasks, setTasks] = useState<any[] | null>(null);
  useEffect(()=>{
    const fetchTasks = async () => {
      const {data,error} = await supabase
      .from("tasks")
      .select("*")
      if(error){
        setFetchError("Could not fetch tasks");
        setTasks(null)
        console.log(error)
      }
      if(data){
        setTasks(data);
        setFetchError(null)
        console.log("DATA:", data);
        console.log("ERROR:", error);
      }
    }
    fetchTasks();
  },[])
  
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {fetchError && <p>{fetchError}nbv</p>}
        {tasks?.map((task:any) => (
          <p key={task.id}>{task.title}</p>
        ))}
      </main>
      <footer className={styles.footer}>
        <a
          href="https://vercel.com/templates?search=turborepo&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://turborepo.dev?utm_source=create-turbo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to turborepo.dev →
        </a>
      </footer>
    </div>
  );
}
