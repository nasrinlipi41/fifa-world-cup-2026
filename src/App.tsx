import { useState, useEffect } from 'react';
import { 
  Tv, AlertTriangle, Heart, Globe, Sparkles
} from 'lucide-react';
import { Channel } from './types';
import LoadingScreen from './components/LoadingScreen';
import StreamPlayer from './components/StreamPlayer';
import ChannelGrid from './components/ChannelGrid';

export default function App() {
  const [isLoadingApp, setIsLoadingApp] = useState(true);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Sync System Clock live
  useEffect(() => {
    const updateClock = () => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch Channels automatically
  useEffect(() => {
    const fetchLiveFeeds = async () => {
      setIsLoadingChannels(true);
      try {
        const response = await fetch('https://raw.githubusercontent.com/nasrinlipi41/fifa-world-cup-2026/refs/heads/main/channels.json');
        if (!response.ok) throw new Error('Dynamic endpoint offline');
        
        const rawData = await response.json();
        
        setChannels(rawData);
        // Default to BeIN Sports if available, otherwise first
        const bein = rawData.find((c: Channel) => c.name.toLowerCase().includes('bein'));
        setSelectedChannel(bein || rawData[0]);
      } catch (err) {
        console.warn('CORS or network blockage fetching GitHub data, fallback triggered.');
        // Fully populated fallback database matching original streams from channels.json
        const fallbackDatabase: Channel[] = [
          {
            name: "T Sports HD",
            logo: "https://s3.aynaott.com/storage/dbc585f70a60b9855b6e13a8ce4cb6f4",
            url: "http://rgkkw.live/live/1Aoen7elp5/IgMJ60tmAa/130714.m3u8"
          },
          {
            name: "Bein Sports",
            logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Bein_sport_logo.png",
            url: "https://1nyaler.streamhostingcdn.top/stream/23/index.m3u8"
          },
          {
            name: "Win Sports",
            logo: "https://files.winsports.co/assets/public/Win_Nuevo_WEB_02.png",
            url: "https://1nyaler.streamhostingcdn.top/stream/32/index.m3u8"
          }
        ];
        
        setChannels(fallbackDatabase);
        setSelectedChannel(fallbackDatabase[1]); // Default to Bein Sports (plays index.m3u8 reliably)
      } finally {
        setIsLoadingChannels(false);
      }
    };

    fetchLiveFeeds();
  }, [refreshTrigger]);

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsFavorite(false); // Reset favorite star toggler per channel
  };

  return (
    <>
      {/* 1. Loading Splash Screen with Official FIFA Theme on Entrance */}
      {isLoadingApp ? (
        <LoadingScreen onComplete={() => setIsLoadingApp(false)} />
      ) : (
        /* 2. Main High-Fidelity Football App Container */
        <div id="full_app_layout" className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f5]">
          
          {/* Top Ticker: Live Match Alerts / World Cup status */}
          <div className="bg-emerald-950/20 border-b border-emerald-900/35 px-4 py-1.5 text-center text-xs text-emerald-400 font-mono tracking-wide flex justify-center items-center gap-2 font-medium">
            <span className="flex h-1.5 w-1.5 rounded-full bg-red-500 animate-ping inline-block shrink-0" />
            <span>ATTENTION FOOTBALL FANS • LIVE STREAM TRANSMISSIONS ACTIVE • RECONNECT FEED CODES ENABLED</span>
          </div>

          {/* Core Header Navigation */}
          <header className="sticky top-0 z-40 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-850 px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.prod.website-files.com/68f550992570ca0322737dc2/69f4a666ff876f5a52a1b7ab_fifa-world-cup-2026-official-logo-footylogos-p-1080.png"
                alt="FIFA World Cup 2026 Logo"
                className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(234,179,8,0.2)]"
              />
              <div className="flex flex-col">
                <span className="text-sm font-display font-extrabold tracking-tight bg-gradient-to-r from-yellow-500 via-emerald-400 to-white bg-clip-text text-transparent">
                  FIFA World Cup 2026
                </span>
                <span className="text-[9px] font-mono text-neutral-400 tracking-wider font-semibold">
                  OFFICIAL STREAMING CENTER
                </span>
              </div>
            </div>

            {/* Time clock and server feed speed check */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-semibold">Pitch Time (UTC)</span>
                <span className="text-xs font-mono font-bold text-emerald-400 tracking-widest">{currentTime || '11:31:00'}</span>
              </div>

              {/* Server Speed status Indicator */}
              <div className="flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-xl shadow-inner">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] font-mono text-neutral-300 font-bold uppercase tracking-wider">UHD feed</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </div>
            </div>
          </header>

          {/* Master Dashboard Grid */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* PRIMARY VIEW COLUMN (Left - 2cols span) */}
              <section className="lg:col-span-2 flex flex-col gap-6">
                
                {/* 1. FOCUS VIDEO PLAYER BLOCK */}
                {selectedChannel ? (
                  <div className="flex flex-col gap-3">
                    <StreamPlayer 
                      streamUrl={selectedChannel.url}
                      channelName={selectedChannel.name}
                      channelLogo={selectedChannel.logo}
                    />

                    {/* Active Feed Stats and Tools */}
                    <div className="bg-neutral-900/40 rounded-xl p-3 border border-neutral-850 flex items-center justify-between text-xs font-sans gap-4">
                      <div>
                        <h2 className="text-sm font-bold text-white tracking-wide">{selectedChannel.name}</h2>
                        <p className="text-[10px] text-neutral-400 mt-0.5">Streaming live broadcast feed</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          id="btn_favorite_channel"
                          onClick={() => setIsFavorite(!isFavorite)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-center ${
                            isFavorite 
                              ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/40' 
                              : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:text-white'
                          }`}
                          title="Add channel to bookmarks"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-neutral-950 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-neutral-850">
                    <AlertTriangle className="w-10 h-10 text-yellow-500 mb-3 animate-bounce" />
                    <h3 className="text-sm font-sans font-bold text-white">No Stream Channel Selected</h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-sm">Please pick a transmission feed from the sidebar to initialize playback.</p>
                  </div>
                )}

              </section>

              {/* SIDEBAR SIDE VIEW COLUMN (Right - 1col span) */}
              <section className="lg:col-span-1 flex flex-col gap-6">

                {/* 1. CHANNEL LIVE FEED DRAWER CARD */}
                <ChannelGrid 
                  channels={channels}
                  selectedChannel={selectedChannel}
                  onSelectChannel={handleSelectChannel}
                  isLoading={isLoadingChannels}
                  onRetryFetch={() => setRefreshTrigger(prev => prev + 1)}
                />

              </section>

            </div>

          </main>

          {/* Universal Footer section with strict stadium design guidelines */}
          <footer className="mt-auto bg-neutral-950 border-t border-neutral-850 px-6 py-6 text-center font-sans">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-3">
                <img 
                  src="https://cdn.prod.website-files.com/68f550992570ca0322737dc2/69f4a666ff876f5a52a1b7ab_fifa-world-cup-2026-official-logo-footylogos-p-1080.png" 
                  alt="FIFA Cup 26 Logo" 
                  className="h-8 w-auto object-contain opacity-50"
                />
                <div className="text-left leading-normal">
                  <p className="font-bold text-neutral-400">FIFA World Cup 2026™ Dynamic IPTV Portal</p>
                  <p className="text-[10px] text-neutral-600">Unified streaming interfaces for United 2026 stadium downlinks.</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 items-center justify-center font-mono text-[10px]">
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-yellow-500" /> UltraLowLatency streaming</span>
                <span>•</span>
                <span>UTC Match clocks configured</span>
                <span>•</span>
                <span>CORS Fallbacks active</span>
              </div>
            </div>
          </footer>

        </div>
      )}
    </>
  );
}
