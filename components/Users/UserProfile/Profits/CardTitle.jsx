import React from 'react';
import PropTypes from 'prop-types';

import styles from './Profits.module.scss';

const CardTitle = ({ title, subTitle, icon }) => (
  <div className={styles.titleWrap}>
    <span className={styles.title}>
      { title }
      <span className={styles.subtitle}>{ subTitle }</span>
    </span>
    { icon }
  </div>
);

CardTitle.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
  icon: PropTypes.element,
};

CardTitle.defaultProps = {
  icon: () => null,
  subTitle: '',
};

export default CardTitle;
