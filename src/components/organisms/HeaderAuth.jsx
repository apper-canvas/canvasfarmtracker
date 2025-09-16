import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { AuthContext } from '../../App';

const HeaderAuth = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  if (!isAuthenticated) return null;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user?.firstName?.charAt(0) || user?.emailAddress?.charAt(0) || 'U'}
          </span>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-gray-900">
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}`
              : user?.emailAddress
            }
          </p>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={logout}
        className="flex items-center space-x-2"
      >
        <ApperIcon name="LogOut" size={16} />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );
};

export default HeaderAuth;