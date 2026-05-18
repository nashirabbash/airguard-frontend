import styles from './LabelText.module.css';

type LabelSize = 'xs' | 'sm';

interface Props {
  text: string;
  size?: LabelSize;
  className?: string;
}

export function LabelText({ text, size = 'xs', className }: Props) {
  return (
    <span className={[styles.root, styles[size], className].filter(Boolean).join(' ')}>
      {text}
    </span>
  );
}
