"use client";
import { TextInput, Input } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import styles from "./searchBar.module.scss";

type Props = {
  placeHolder?: string;
  onChange?: (value: string) => void;
};

export default function SearchBar({
  placeHolder = "検索",
  onChange = () => {},
}: Props) {
  const [value, setValue] = useState("");
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);
  return (
    <TextInput
      className={styles.textInput}
      placeholder={placeHolder}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      leftSection={<IconSearch />}
      rightSection={
        value !== "" ? (
          <Input.ClearButton onClick={() => setValue("")} />
        ) : undefined
      }
      rightSectionPointerEvents="auto"
    ></TextInput>
  );
}
