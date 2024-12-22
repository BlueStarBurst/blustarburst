import { cn, Link, LinkIcon, NextUIProvider } from '@nextui-org/react';
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
        'scroll pointer-events-none min-h-screen w-screen transition-all duration-400',
        powered['plug2']
          ? 'border-black bg-white text-black'
          : 'border-white bg-black text-white'
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
            'absolute bottom-0 flex flex-col items-center justify-start rounded-lg border border-black bg-gray-500 bg-opacity-20 py-4 backdrop-blur-sm transition-all duration-700',
            powered['plug1']
              ? '-translate-x-[20vw] translate-y-[30%] -rotate-[5deg]'
              : 'translate-y-[100%] rotate-90',
            powered['plug2'] ? 'border-black' : 'border-white'
          )}
        >
          <div className="absolute text-xl font-semibold">
            <p>Projects</p>
          </div>
          <div className="scroll pointer-events-auto mt-2 h-[700px] w-[500px] overflow-auto pt-8">
            <div className="flex h-max flex-col gap-2 px-8">
              <Link
                isExternal
                href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
              >
                <div className="flex w-full cursor-pointer flex-row rounded-lg border border-black p-4 transition-colors hover:bg-gray-500/30">
                  Tensorboard
                  <div className="h-[100px]" />
                </div>
              </Link>

              <div className="flex w-full flex-row justify-between gap-4">
                <Link
                  isExternal
                  href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
                  className="flex w-full cursor-pointer flex-row rounded-lg border border-black p-4 transition-colors hover:bg-gray-500/30"
                >
                  <div>
                    ourworlds!
                    <div className="h-[100px]" />
                  </div>
                </Link>
                <Link
                  isExternal
                  href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
                  className="flex w-full cursor-pointer flex-row rounded-lg border border-black p-4 transition-colors hover:bg-gray-500/30"
                >
                  <div>
                    storyboard!
                    <div className="h-[100px]" />
                  </div>
                </Link>
              </div>

              <Link
                isExternal
                href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
              >
                <div className="flex w-full cursor-pointer flex-row rounded-lg border border-black p-4 transition-colors hover:bg-gray-500/30">
                  AIM
                  <div className="h-[500px]" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
