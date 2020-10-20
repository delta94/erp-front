import PropTypes from 'prop-types';
import { Spin } from 'antd';

const SuspenseLoader = ({
  children, loading, loaderSize, ...props
}) => (
  loading
    ? (<Spin size={loaderSize} {...props} />)
    : (children)
);

SuspenseLoader.propTypes = {
  children: PropTypes.any,
  loading: PropTypes.bool.isRequired,
  loaderSize: PropTypes.oneOf(['small', 'medium', 'large']),
};

SuspenseLoader.defaultProps = {
  children: null,
  loaderSize: 'medium',
};

export default SuspenseLoader;
