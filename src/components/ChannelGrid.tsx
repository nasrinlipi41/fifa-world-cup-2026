import { useState } from 'react';
import { Search, Tv, RefreshCw, Layers, Compass, HelpCircle, AlertCircle } from 'lucide-react';
import { Channel } from '../types';

interface ChannelGridProps {
  channels: Channel[];
  selectedChannel: Channel | null;
  onSelectChannel: (channel: Channel) => void;
  isLoading: boolean;
  onRetryFetch: () => void;
}

export default function ChannelGrid({ 
  channels, 
  selectedChannel, 
  onSelectChannel, 
  isLoading, 
  onRetryFetch 
}: ChannelGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter channels based on search query
  const filteredChannels = channels.filter(chan => {
    return chan.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-neutral-900/60 backdrop-blur-md rounded-2xl border border-neutral-850 p-5 flex flex-col gap-4">
      {/* Search and filter row */}
      <div className="flex flex-col gap-3 py-1 border-b border-neutral-850 pb-4">
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <Tv className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-sans font-bold text-white tracking-wide">Live Stream Feeds</h3>
          </div>
          
          <button
            id="reload_feeds_btn"
            onClick={onRetryFetch}
            className="p-1 px-2.5 bg-neutral-950/80 hover:bg-neutral-900 border border-neutral-850 text-[10px] font-semibold text-neutral-400 hover:text-white rounded-lg flex items-center gap-1.5 transition-all select-none cursor-pointer"
            title="Refresh stream channel list"
          >
            <RefreshCw className="w-3 h-3 animate-pulse" />
            Reload Lists
          </button>
        </div>

        {/* Search Input only */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="channel_search_input"
            type="text"
            placeholder="Search streaming channel name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-850 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none transition-all font-sans"
          />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-2 select-none">
          <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs text-neutral-400 font-medium">Fetching live streaming sources...</p>
        </div>
      ) : filteredChannels.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredChannels.map((chan) => {
            const isSelected = selectedChannel?.url === chan.url;

            return (
              <button
                key={chan.url + chan.name}
                id={`chan_card_${chan.name.replace(/\s+/g, '_')}`}
                onClick={() => onSelectChannel(chan)}
                className={`relative group text-left p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-[120px] select-none hover:shadow-lg ${
                  isSelected 
                    ? 'bg-emerald-500/10 border-emerald-500 shadow-emerald-500/10' 
                    : 'bg-neutral-950/40 border-neutral-850 hover:bg-neutral-900/60 hover:border-neutral-800'
                }`}
              >
                {/* Channel top tags */}
                <div className="flex justify-between items-start w-full gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono tracking-widest font-extrabold flex items-center gap-1 shrink-0 bg-emerald-500/10 text-emerald-400 border border-emerald-400/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE FEED
                  </span>
                  
                  {/* No OnAir badge as requested */}
                </div>

                {/* Main section: Logo & descriptive name */}
                <div className="flex items-center gap-2.5 mt-auto">
                  <img 
                    src={chan.logo} 
                    alt={chan.name}
                    className="w-9 h-9 rounded-full object-contain bg-neutral-950 border border-neutral-800 p-0.5 shrink-0 group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3024/3024605.png'; // Football icon fallback
                    }}
                  />
                  <div className="min-w-0">
                    <h4 className="text-xs font-sans font-bold text-neutral-200 group-hover:text-white truncate transition-colors leading-tight">
                      {chan.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500 font-mono mt-0.5 truncate uppercase">
                      Stadium Source
                    </p>
                  </div>
                </div>

                {/* Outer decorative card highlights */}
                <div className="absolute inset-0 bg-radial-[circle_at_bottom_right,_var(--tw-gradient-stops)] from-neutral-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center text-center gap-3 p-4 bg-neutral-950/20 rounded-xl border border-dashed border-neutral-850">
          <AlertCircle className="w-8 h-8 text-neutral-600" />
          <div>
            <h4 className="text-xs font-sans font-bold text-neutral-400">No feeds found</h4>
            <p className="text-[10px] text-neutral-500 mt-1 max-w-xs leading-normal">
              We couldn't match any streaming feeds with the query term "{searchQuery}". Try searching for another channel.
            </p>
          </div>
        </div>
      )}

      {/* Embedded footer status */}
      <div className="bg-neutral-950/50 rounded-xl p-3 border border-neutral-850 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-[10px] text-neutral-400 leading-normal font-sans">
          <span className="font-semibold text-neutral-200 block">Streaming Advisory Note:</span> 
          HLS (.m3u8) streams automatically adjust quality under changing network conditions for stable, buffer-free playback.
        </div>
      </div>
    </div>
  );
}
