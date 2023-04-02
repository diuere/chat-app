import { Icon } from '@iconify/react';

import { Link } from 'react-router-dom';
import { useMediaQuery } from '../helpers/custom-hooks';

const BackToHomeBtn = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <Link
      to="/"
      className={
        isMobile ? 'd-flex p-0 mr-2 text-blue link-unstyled h-100' : 'd-none'
      }
    >
      <Icon icon="material-symbols:arrow-circle-left" width="26" height="26" />
    </Link>
  );
};

export default BackToHomeBtn;
