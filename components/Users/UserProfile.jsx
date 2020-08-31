import React from 'react';
import { useRouter } from 'next/router';

const UserProfile = () => {
  const { query } = useRouter();

  return (
    <>
      { `User ID: ${query.id}` }
    </>
  );
};

export default UserProfile;
