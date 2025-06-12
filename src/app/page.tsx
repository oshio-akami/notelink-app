"use client";

import Link from "next/link";
import { Text, Button, Image } from "@mantine/core";
import styles from "./page.module.scss";

export default function Page() {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <Image w={200} src="sample_logo.png" alt="" />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.catchCopy}>
            <Text>仲間とつながる</Text>
            <Text>情報共有スペース</Text>
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
        <div className={styles.rightSection}>
          <Image src="sample_image.png" alt="" />
        </div>
      </div>
    </div>
  );
}
