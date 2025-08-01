import * as React from 'react';

import CharacterCard from '@/components/CharacterCard';
import GameMap from '@/components/GameMap';
import MissionCard from '@/components/MissionCard';
import RPGGameUI from '@/components/RPGGameUI';

export default function HomePage() {
  return (
    <div>
      {/* Game Map Demo Section */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              🗺️ Game World Map
            </span>
          </h2>
          
          <div className="mb-12">
            <GameMap />
          </div>
        </div>
      </div>

      {/* Character Cards Demo Section */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              🏰 Character Gallery
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {/* Different character examples */}
            <CharacterCard 
              name="Elven Mage"
              level={42}
              experience={1250}
              maxExperience={2000}
              avatar="🧝‍♀️"
            />
            
            <CharacterCard 
              name="Dragon Warrior"
              level={38}
              experience={800}
              maxExperience={1500}
              avatar="🐉"
            />
            
            <CharacterCard 
              name="Shadow Rogue"
              level={45}
              experience={2100}
              maxExperience={2500}
              avatar="🥷"
            />
            
            <CharacterCard 
              name="Crystal Healer"
              level={40}
              experience={1600}
              maxExperience={2200}
              avatar="🔮"
            />
            
            <CharacterCard 
              name="Fire Wizard"
              level={50}
              experience={3200}
              maxExperience={4000}
              avatar="🧙‍♂️"
            />
            
            <CharacterCard 
              name="Forest Guardian"
              level={35}
              experience={900}
              maxExperience={1800}
              avatar="🌳"
            />
            
            <CharacterCard 
              name="Storm Caller"
              level={47}
              experience={2800}
              maxExperience={3500}
              avatar="⚡"
            />
            
            <CharacterCard 
              name="Moon Archer"
              level={41}
              experience={1400}
              maxExperience={2100}
              avatar="🏹"
            />
          </div>

          {/* Mission Cards Demo Section */}
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              📜 Quest Log
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Different mission examples */}
            <MissionCard 
              title="Ethereal Exchange"
              description="Complete a mystical token swap to unlock ancient treasures and prove your mastery over the digital realm."
              requiredAction="Swap ETH → USDC"
              status="in_progress"
              reward="500 XP + Rare Crystal"
              difficulty="medium"
              timeRemaining="2h 30m"
              progress={1}
              maxProgress={3}
            />
            
            <MissionCard 
              title="Dragon's Hoard"
              description="Accumulate legendary tokens to awaken the sleeping dragon and claim its mystical powers."
              requiredAction="Stake 1000 DRAGON"
              status="completed"
              reward="1200 XP + Dragon Scale"
              difficulty="hard"
              progress={5}
              maxProgress={5}
            />
            
            <MissionCard 
              title="Celestial Bridge"
              description="Cross between realms by bridging tokens through the cosmic gateway, connecting distant worlds."
              requiredAction="Bridge MATIC → ETH"
              status="pending"
              reward="750 XP + Cosmic Orb"
              difficulty="legendary"
              timeRemaining="1d 12h"
            />
            
            <MissionCard 
              title="Alchemist's Dream"
              description="Transform base metals into gold through the ancient art of liquidity provision."
              requiredAction="Add LP to USDC/ETH"
              status="in_progress"
              reward="600 XP + Philosopher's Stone"
              difficulty="medium"
              timeRemaining="4h 15m"
              progress={2}
              maxProgress={4}
            />
            
            <MissionCard 
              title="Shadow Market"
              description="Navigate the mysterious dark pools to execute trades unseen by mortal eyes."
              requiredAction="Trade via Dark Pool"
              status="failed"
              reward="400 XP + Shadow Essence"
              difficulty="hard"
            />
            
            <MissionCard 
              title="Novice's Journey"
              description="Begin your adventure in the decentralized realm with your first token acquisition."
              requiredAction="Buy any ERC-20 token"
              status="completed"
              reward="200 XP + Welcome Badge"
              difficulty="easy"
            />
          </div>
        </div>
      </div>

      {/* Original RPG Game UI */}
      <RPGGameUI />
    </div>
  );
}
