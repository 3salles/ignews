import { SignInButton } from "./SignInButton";
import styles from "./styles.module.scss";
import Link from "next/link";
import Image from "next/image";
import { ActiveLink } from "./ActiveLink";

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
          <ActiveLink href="/" activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href="/posts" prefetch activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
