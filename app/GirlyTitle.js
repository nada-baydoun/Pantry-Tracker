import React from 'react';
import styled from 'styled-components';
import { Typography } from '@mui/material';

const TitleWrapper = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #FF1493;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// color: #FF1493;

const StyledTitle = styled(Typography)`
  font-family: 'Courgette', cursive;
  color: #FFD1DC;
  font-size: 3.5rem;
  text-shadow: 2px 2px 4px rgba(255, 105, 180, 0.3);
  letter-spacing: 2px;

  @media (max-width: 600px) {
    font-size: 2.5rem;
  }
`;

const Sparkle = styled.span`
  display: inline-block;
  animation: sparkle 1.5s infinite alternate;
  margin: 0 5px;

  @keyframes sparkle {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.2); opacity: 1; }
  }
`;

const GirlyTitle = () => (
  <TitleWrapper>
    <StyledTitle variant="h1">
      <Sparkle>✨</Sparkle>
      Pantry Professional Managemenet System
      <Sparkle>✨</Sparkle>
    </StyledTitle>
  </TitleWrapper>
);

export default GirlyTitle;