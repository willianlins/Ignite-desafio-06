/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types

import styles from './header.module.scss';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/Logo.svg" alt="logo" />
      </div>
    </header>
  );
}
