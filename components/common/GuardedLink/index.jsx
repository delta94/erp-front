import Link from 'next/link';
import PropTypes from 'prop-types';

import Can from '../Can';

const GuardedLink = ({
  href, as, label, gate, children, hideIfFailed,
}) => (
  <Can
    perform={gate}
    yes={(
      <Link href={href} as={as}>
        { /* eslint-disable-next-line jsx-a11y/anchor-is-valid */ }
        <a>{label || children}</a>
      </Link>
    )}
    no={hideIfFailed ? null : (label || children)}
  />
);

GuardedLink.propTypes = {
  href: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gate: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    all: PropTypes.arrayOf(PropTypes.string),
    any: PropTypes.arrayOf(PropTypes.string),
    except: PropTypes.arrayOf(PropTypes.string),
  })]).isRequired,
  as: PropTypes.string,
  children: PropTypes.any,
  hideIfFailed: PropTypes.bool,
};

GuardedLink.defaultProps = {
  as: '',
  children: null,
  label: '',
  hideIfFailed: false,
};

export default GuardedLink;
