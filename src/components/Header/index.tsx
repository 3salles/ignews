import { SignInButton } from "./SignInButton";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/" passHref>
          <Image
            src="/images/logo.svg"
            alt="Logo do ig.news"
            height={31}
            width={110}
          />
        </Link>

        <nav>
          <a className={styles.active} href="#">
            Home
          </a>
          <a href="#">Posts</a>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
