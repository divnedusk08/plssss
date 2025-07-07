import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function GetStartedButton() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(user ? '/log' : '/login')}
      className="mb-12 px-8 py-4 rounded-lg bg-primary text-white font-bold text-xl hover:bg-primary-dark transition shadow-lg"
    >
      Get Started
    </button>
  );
} 