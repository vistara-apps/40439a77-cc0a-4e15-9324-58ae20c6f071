-- Create tduel_trading_sessions table
CREATE TABLE IF NOT EXISTS public.tduel_trading_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT,
    mode TEXT NOT NULL CHECK (mode IN ('regular', 'vs', 'battle')),
    start_balance DECIMAL(20, 8) NOT NULL,
    current_balance DECIMAL(20, 8) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    pnl DECIMAL(20, 8) DEFAULT 0,
    pnl_percentage DECIMAL(10, 4) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    challenge_settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tduel_trades table
CREATE TABLE IF NOT EXISTS public.tduel_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.tduel_trading_sessions(id) ON DELETE CASCADE,
    coin TEXT NOT NULL CHECK (coin IN ('BTC', 'SOL', 'ETH', 'PUMP', 'DOGE')),
    type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
    amount DECIMAL(20, 8) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    total_cost DECIMAL(20, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tduel_positions table
CREATE TABLE IF NOT EXISTS public.tduel_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.tduel_trading_sessions(id) ON DELETE CASCADE,
    coin TEXT NOT NULL CHECK (coin IN ('BTC', 'SOL', 'ETH', 'PUMP', 'DOGE')),
    amount DECIMAL(20, 8) NOT NULL,
    average_price DECIMAL(20, 8) NOT NULL,
    current_price DECIMAL(20, 8) NOT NULL,
    pnl DECIMAL(20, 8) DEFAULT 0,
    pnl_percentage DECIMAL(10, 4) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tduel_challenges table
CREATE TABLE IF NOT EXISTS public.tduel_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_address TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('vs', 'battle')),
    participants TEXT[] DEFAULT ARRAY[]::TEXT[],
    wager DECIMAL(20, 8),
    prizes DECIMAL(20, 8)[],
    settings JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    winner_address TEXT,
    leaderboard JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tduel_leaderboard table
CREATE TABLE IF NOT EXISTS public.tduel_leaderboard (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_address TEXT NOT NULL UNIQUE,
    username TEXT,
    total_trades INTEGER DEFAULT 0,
    total_pnl DECIMAL(20, 8) DEFAULT 0,
    total_pnl_percentage DECIMAL(10, 4) DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tduel_trading_sessions_user_address ON public.tduel_trading_sessions(user_address);
CREATE INDEX IF NOT EXISTS idx_tduel_trading_sessions_status ON public.tduel_trading_sessions(status);
CREATE INDEX IF NOT EXISTS idx_tduel_trading_sessions_mode ON public.tduel_trading_sessions(mode);

CREATE INDEX IF NOT EXISTS idx_tduel_trades_session_id ON public.tduel_trades(session_id);
CREATE INDEX IF NOT EXISTS idx_tduel_trades_coin ON public.tduel_trades(coin);
CREATE INDEX IF NOT EXISTS idx_tduel_trades_timestamp ON public.tduel_trades(timestamp);

CREATE INDEX IF NOT EXISTS idx_tduel_positions_session_id ON public.tduel_positions(session_id);
CREATE INDEX IF NOT EXISTS idx_tduel_positions_coin ON public.tduel_positions(coin);

CREATE INDEX IF NOT EXISTS idx_tduel_challenges_creator_address ON public.tduel_challenges(creator_address);
CREATE INDEX IF NOT EXISTS idx_tduel_challenges_status ON public.tduel_challenges(status);
CREATE INDEX IF NOT EXISTS idx_tduel_challenges_mode ON public.tduel_challenges(mode);

CREATE INDEX IF NOT EXISTS idx_tduel_leaderboard_user_address ON public.tduel_leaderboard(user_address);
CREATE INDEX IF NOT EXISTS idx_tduel_leaderboard_rank ON public.tduel_leaderboard(rank);
CREATE INDEX IF NOT EXISTS idx_tduel_leaderboard_total_pnl ON public.tduel_leaderboard(total_pnl DESC);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.tduel_trading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tduel_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tduel_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tduel_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tduel_leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Public read access" ON public.tduel_trading_sessions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.tduel_trading_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.tduel_trading_sessions FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.tduel_trades FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.tduel_trades FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.tduel_trades FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.tduel_positions FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.tduel_positions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.tduel_positions FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.tduel_challenges FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.tduel_challenges FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.tduel_challenges FOR UPDATE USING (true);

CREATE POLICY "Public read access" ON public.tduel_leaderboard FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON public.tduel_leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON public.tduel_leaderboard FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_tduel_trading_sessions_updated_at BEFORE UPDATE ON public.tduel_trading_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tduel_positions_updated_at BEFORE UPDATE ON public.tduel_positions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tduel_challenges_updated_at BEFORE UPDATE ON public.tduel_challenges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tduel_leaderboard_updated_at BEFORE UPDATE ON public.tduel_leaderboard FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();