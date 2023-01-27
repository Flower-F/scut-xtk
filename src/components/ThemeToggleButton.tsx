import { useLocalStorageState } from 'ahooks';
import { useEffect } from 'react';

const THEMES = ['corporate', 'dark'];

export function ThemeToggleButton() {
  const [themeIndex, setThemeIndex] = useLocalStorageState('scut-xtk-theme', {
    defaultValue: 0,
  });

  function handleThemeChange() {
    const nextThemeIndex = (themeIndex + 1) % THEMES.length;
    setThemeIndex(nextThemeIndex);
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES[themeIndex] || 'corporate');
  }, [themeIndex]);

  return (
    <label tabIndex={0} className='cursor-pointer' onClick={() => handleThemeChange()}>
      主题
    </label>
  );
}
