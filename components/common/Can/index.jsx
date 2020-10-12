import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { signedUserSelector } from '../../../store/auth/selectors';

function retrieveIdsFromPermission(permission) {
  const [, , ids] = permission.split('.');
  let array = null;
  if (ids) array = ids.split(',');
  return array;
}

const Can = ({
  perform, yes, no, loading,
}) => {
  const [user] = useSelector(signedUserSelector);

  const check = useCallback((permission, type) => {
    if (user) {
      if (type === 'except') return user.permissions.includes(permission);
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
      return Object.keys(perform).reduce((all, key) => {
        const checks = perform[key].map((i) => check(i, key));
        const results = checks.filter((item) => item);
        switch (key) {
          case 'all': return all && results.length === checks.length;
          case 'any': return all && results.length > 0;
          case 'except': return all && results.length === 0;
          default: return all;
        }
      }, true);
    }
    return check(perform);
  }, [perform, check]);

  if (!user) return loading || null;

  return canPerform ? yes : no;
};

Can.propTypes = {
  perform: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({
    all: PropTypes.arrayOf(PropTypes.string),
    any: PropTypes.arrayOf(PropTypes.string),
    except: PropTypes.arrayOf(PropTypes.string),
  })]).isRequired,
  yes: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([null])]).isRequired,
  no: PropTypes.oneOfType([PropTypes.element, PropTypes.oneOf([null]), PropTypes.string]),
  loading: PropTypes.element,
};

Can.defaultProps = {
  no: null,
  checkType: 'all',
};

export default Can;
