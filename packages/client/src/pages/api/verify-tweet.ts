import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface VerifyTweetRequest {
  tweetText: string;
  userId: string;
  tweetId?: string;
}

interface VerifyTweetResponse {
  verified: boolean;
  tweetId?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyTweetResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ verified: false, error: 'Method not allowed' });
  }

  const { tweetText, userId, tweetId }: VerifyTweetRequest = req.body;

  if (!tweetText || !userId) {
    return res.status(400).json({ 
      verified: false, 
      error: 'Missing required parameters' 
    });
  }

  try {
    // Twitter API v2 credentials
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;
    if (!bearerToken) {
      return res.status(500).json({ 
        verified: false, 
        error: 'Twitter API not configured' 
      });
    }

    // If we have a tweet ID, verify it directly
    if (tweetId) {
      const response = await axios.get(`https://api.twitter.com/2/tweets/${tweetId}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      });

      const tweet = response.data.data;
      const isVerified = tweet && 
        tweet.text.includes(tweetText.substring(0, 50)) && // Check if text matches
        tweet.author_id === userId;

      return res.status(200).json({ 
        verified: isVerified, 
        tweetId: tweetId 
      });
    }

    // Search for recent tweets by user containing the text
    const searchResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=10&tweet.fields=created_at`,
      {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
      }
    );

    const tweets = searchResponse.data.data || [];
    const matchingTweet = tweets.find((tweet: any) => 
      tweet.text.includes(tweetText.substring(0, 50)) &&
      new Date(tweet.created_at) > new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
    );

    return res.status(200).json({ 
      verified: !!matchingTweet, 
      tweetId: matchingTweet?.id 
    });

  } catch (error) {
    console.error('Error verifying tweet:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Twitter API error:', error.response?.data);
    }
    
    return res.status(500).json({ 
      verified: false, 
      error: 'Failed to verify tweet' 
    });
  }
} 