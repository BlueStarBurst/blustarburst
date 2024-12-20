import { cn, NextUIProvider } from '@nextui-org/react';
import './App.css';
import Canvas from './Canvas';
import { ThemeContext, ThemeProviderWrapper } from './ThemeProvider';
import { useContext, useState } from 'react';

function App() {
  const [powered, setPowered] = useState<{ [key: string]: boolean }>({
    plug2: true,
  });

  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={cn(
        'pointer-events-none min-h-screen w-screen transition-all duration-400',
        powered['plug2']
          ? 'border-black bg-white text-black light'
          : 'border-white bg-black text-white dark'
      )}
    >
      <Canvas powered={powered} setPowered={setPowered} />
      <div
        className={cn(
          'absolute z-10 flex h-screen w-screen flex-row items-center justify-center overflow-hidden '
        )}
      >
        <div
          className={cn(
            'text-3xl font-semibold transition-all',
            powered['plug1'] ? '-translate-y-[35vh]' : 'translate-y-0 scale-150'
          )}
        >
          <p>Bryant Hargreaves</p>
        </div>
        <div
          className={cn(
            'absolute bottom-0 rounded-lg  border border-inherit bg-gray-500 bg-opacity-20 py-4 transition-all duration-700',
            powered['plug1']
              ? '-translate-x-[20vw] translate-y-[30%] -rotate-[5deg]'
              : 'translate-y-[100%] rotate-90'
          )}
        >
          <div className="text-xl font-semibold">
            <p>Projects</p>
          </div>
          <div className="pointer-events-auto mt-2 h-[700px] w-[500px] overflow-auto">
            <div className="flex h-max flex-col gap-1 px-8 opacity-30">
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
              <div className="h-20 w-full bg-gray-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
