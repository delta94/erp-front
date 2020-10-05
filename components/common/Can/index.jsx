import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { accountSelector } from '../../../store/auth/selectors';

function retrieveIdsFromPermission(permission) {
  const [, , ids] = permission.split('.');
  let array = null;
  if (ids) array = ids.split(',');
  return array;
}

const Can = ({
  perform, yes, no, loading, checkType,
}) => {
  const [user] = useSelector(accountSelector);

  const check = useCallback((permission) => {
    if (user) {
      if (user.permissions.includes('*')) return true;
      if (permission === '*') return true;
      const ids = retrieveIdsFromPermission(permission);
      if (ids) {
        const [entity, action] = permission.split('.');
        const hasAccessIds = [
          ...(
            new Set(
              user.permissions
                .filter((item) => {
                  const [e, a, i] = item.split('.');
                  return i && e === entity && a === action;
                })
                .map(retrieveIdsFromPermission)
                .flat(),
            )
          ),
        ];
        for (let i = 0; i < ids.length; i += 1) {
          if (!hasAccessIds.includes(ids[i])) return false;
        }
        return true;
      }
      return user.permissions.includes(permission);
    }
    return false;
  }, [user]);

  const canPerform = useMemo(() => {
    if (typeof perform === 'object') {
      const checks = perform.map(check);
      const results = checks.filter((item) => item);
      return (checkType === 'all' && results.length === checks.length) || (checkType === 'any' && results.length > 0);
    }
    return check(perform);
  }, [perform, check, checkType]);

  if (!user) return loading || null;

  return canPerform ? yes : no;
};

Can.propTypes = {
  perform: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]).isRequired,
  yes: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([null])]).isRequired,
  no: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([null]), PropTypes.string]),
  loading: PropTypes.element,
  checkType: PropTypes.oneOf(['any', 'all']),
};

Can.defaultProps = {
  no: null,
  checkType: 'all',
};

export default Can;
