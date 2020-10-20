import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Empty, Result } from 'antd';

const EntityAccessMiddleware = ({
  children, response, loading, entityName, mode,
}) => {
  const error = useMemo(() => {
    if (!response.found) {
      return mode === 'full' ? (
        <Result
          status='404'
          title='Not Found'
          subTitle={`Sorry, such ${entityName} does not exist.`}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Not found' />
      );
    }
    if (response.forbidden) {
      return mode === 'full' ? (
        <Result
          status='403'
          title='Access denied'
          subTitle={`It seems that you don't have an access to ${entityName}.`}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No access' />
      );
    }
    if (response.serverError) {
      return mode === 'full' ? (
        <Result
          status='500'
          title='Server error'
          subTitle='Oops! Something went wrong. Try again later or contact your administrator'
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Server error' />
      );
    }
    return null;
  }, [response, entityName, mode]);

  return error && !loading
    ? error
    : children;
};

EntityAccessMiddleware.propTypes = {
  children: PropTypes.any,
  response: PropTypes.shape({
    found: PropTypes.bool.isRequired,
    forbidden: PropTypes.bool.isRequired,
  }),
  loading: PropTypes.bool,
  entityName: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['simple', 'full']),
};

EntityAccessMiddleware.defaultProps = {
  children: null,
  response: {
    found: false,
    forbidden: false,
    serverError: false,
  },
  loading: false,
  mode: 'full',
};

export default EntityAccessMiddleware;
