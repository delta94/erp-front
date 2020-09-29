import React from 'react';
import PropTypes from 'prop-types';

import styles from './CardTitle.module.scss';

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
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  icon: PropTypes.element,
};

CardTitle.defaultProps = {
  icon: () => null,
  subTitle: '',
};

export default CardTitle;
