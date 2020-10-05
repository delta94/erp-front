import { useRouter } from 'next/router';
import { Button, PageHeader } from 'antd';

import styles from '../Clients/Clients.module.scss';

const ProjectProfile = () => {
  const { back, query } = useRouter();

  return (
    <>
      <PageHeader
        className={styles.pageHeader}
        title='Project'
        onBack={back}
        extra={[
          <Button key={0} type='primary'>Edit</Button>,
        ]}
      />
      { `Project ID: ${query.id}` }
    </>
  );
};

export default ProjectProfile;
