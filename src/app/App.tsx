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
        'scroll pointer-events-none min-h-screen w-screen transition-all duration-700',
        powered['plug2']
          ? 'border-black/75  bg-white text-black'
          : 'border-white/50 bg-black text-white'
      )}
    >
      <Canvas powered={powered} setPowered={setPowered} />
      <div
        className={cn(
          'absolute z-0 flex h-screen w-screen flex-row items-center justify-center overflow-hidden transition-all duration-700 ',
          powered['plug2']
            ? 'border-black/75  text-black'
            : 'border-white/50 text-white'
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
            'absolute bottom-0 flex flex-col items-center justify-start rounded-lg border border-black/75  bg-pink-500/35 py-4 backdrop-blur-sm transition-all duration-700',
            powered['plug1']
              ? '-translate-x-[0vw] translate-y-[30%] -rotate-[5deg]'
              : 'translate-y-[100%] rotate-90',
            powered['plug2']
              ? 'border-black/75  text-black'
              : 'border-white/50 text-white'
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
                <div
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-start rounded-lg border p-4 transition-all duration-700 hover:bg-gray-500/30',
                    powered['plug2']
                      ? 'border-black/75  text-black'
                      : 'border-white/50 text-white'
                  )}
                >
                  Tensorboard
                  <p className="text-left text-sm">
                    An online drag-and-drop tool to help students learn about
                    machine learning through code snippets!
                  </p>
                  {/* <div className="h-[50px]" /> */}
                </div>
              </Link>

              <div className="flex w-full flex-row justify-between gap-4">
                <Link
                  isExternal
                  href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-start justify-start rounded-lg border p-4 transition-all duration-700 hover:bg-gray-500/30',
                    powered['plug2']
                      ? 'border-black/75  text-black'
                      : 'border-white/50 text-white'
                  )}
                >
                  ourworlds!
                  <p className="text-left text-xs">
                    An online drag-and-drop tool to help students learn about
                    machine learning through code snippets!
                  </p>
                </Link>
                <Link
                  isExternal
                  href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-start justify-start rounded-lg border p-4 transition-all duration-700 hover:bg-gray-500/30',
                    powered['plug2']
                      ? 'border-black/75  text-black'
                      : 'border-white/50 text-white'
                  )}
                >
                  storyboard!
                  <p className="text-left text-xs">
                    An online drag-and-drop tool to help students learn about
                    machine learning through code snippets!
                  </p>
                </Link>
              </div>

              <Link
                isExternal
                href="https://tensorboard--tensorboard-234f6.us-central1.hosted.app"
              >
                <div
                  className={cn(
                    'flex w-full cursor-pointer flex-col items-start rounded-lg border p-4 transition-all duration-700 hover:bg-gray-500/30',
                    powered['plug2']
                      ? 'border-black/75  text-black'
                      : 'border-white/50 text-white'
                  )}
                >
                  AIM
                  <p className="text-left text-sm">
                    An online drag-and-drop tool to help students learn about
                    machine learning through code snippets!
                  </p>
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
