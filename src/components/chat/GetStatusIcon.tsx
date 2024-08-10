
import DoubleTick from './DoubleTick';
import SingleTick from './SingleTick';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'sent':
      return <SingleTick />;
    case 'delivered':
      return <DoubleTick />
    case 'read':
      return <DoubleTick color='blue'/>;
    default:
      return null;
  }
};

export default getStatusIcon;
