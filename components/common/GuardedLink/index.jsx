import Link from 'next/link';
import PropTypes from 'prop-types';

import Can from '../Can';

const GuardedLink = ({
  href, label, gates, checkType,
}) => (
  <Can
    perform={gates}
    checkType={checkType}
    yes={(
      <Link href={href}>
        { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
        <a>{label}</a>
      </Link>
    )}
    no={label}
  />
);

GuardedLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  gates: PropTypes.arrayOf(PropTypes.string).isRequired,
  checkType: PropTypes.oneOf(['any', 'all']),
};

GuardedLink.defaultProps = {
  checkType: 'any',
};

export default GuardedLink;
