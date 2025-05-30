"use client";

import Link from "next/link";
import { Text, Button, Image } from "@mantine/core";
import styles from "./page.module.scss";
import { useMediaQuery } from "@mantine/hooks";

export default function Page() {
  const matches = useMediaQuery("(min-width: 1200px)");
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Image
          w={200}
          src="https://pub-0e85cec67fe344ccb5094d3659571d7d.r2.dev/sample_logo.png"
          alt=""
        />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.catchCopy}>
            <Text c="#191970" fw={700} size={matches ? "4rem" : "3rem"}>
              仲間とつながる
            </Text>
            <Text c="#191970" fw={700} size={matches ? "4rem" : "3rem"}>
              情報共有スペース
            </Text>
          </div>
          <div className={styles.subtitle}>
            <Text>招待された仲間だけが集うグループ空間。</Text>
            <Text>
              記事を投稿し、読み合い、アイデアや知識を安心して共有できます。
            </Text>
          </div>
          <Link href="/login">
            <Button size="lg">今すぐ始める</Button>
          </Link>
        </div>
        {matches && (
          <div className={styles.rightSection}>
            <Image
              src="https://pub-0e85cec67fe344ccb5094d3659571d7d.r2.dev/sample_image.png"
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
}
