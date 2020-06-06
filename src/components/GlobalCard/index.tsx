import React from 'react';
import Styles from './index.css';

export interface GlobalCardProps {
  title: string | React.ReactNode;
  bodyStyle?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}

const GlobalCard: React.FC<GlobalCardProps> = props => {
  const { children, title, bodyStyle, titleStyle } = props;
  return (
    <div className={Styles.container}>
      <div className={Styles.title} style={titleStyle}>{title}</div>
      <div className={Styles.body} style={bodyStyle}>{children}</div>
    </div>
  );
};

export default GlobalCard;
