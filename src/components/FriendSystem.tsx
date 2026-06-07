import React, { useState, useEffect, useCallback } from 'react';
import { FloatingBack } from './FloatingBack';
import { supabase } from '../data/supabase';
import { useUI } from '../lib/UILanguageContext';
import { getFriends, getWeeklyRanking, isOfflineMode, OfflineFriend } from '../lib/offlineData';

const SESSION_KEY_STORE = 'yandao_session_v5';
function getSessionKey() { return localStorage.getItem(SESSION_KEY_STORE) ?? 'anon'; }

interface Friend {
  id: string;
  other_key: string;
  status: string;
  is_requester: boolean;
}

interface FriendTask {
  id: string;
  task_label: string;
  user1_value: number;
  user2_value: number;
  target_value: number;
  completed: boolean;
  xp_reward: number;
}

interface BuddyUser {
  id: string;
  nickname: string;
  avatar: string;
  language: string;
  gender: string;
  age: number;
  distance: number;
  level: number;
  interests: string[];
}

interface FriendSystemProps {
  sessionKey?: string;
  weekXP?: number;
  onBack: () => void;
}

const LANGUAGES = [
  { code: 'ja', name: '日语' },
  { code: 'en', name: '英语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'es', name: '西班牙语' },
  { code: 'de', name: '德语' },
];

const DISTANCE_RANGES = [
  { label: '1km', value: 1 },
  { label: '5km', value: 5 },
  { label: '10km', value: 10 },
  { label: '20km', value: 20 },
  { label: '50km', value: 50 },
];

export const FriendSystem: React.FC<FriendSystemProps> = ({
  sessionKey: propKey,
  weekXP = 0,
  onBack,
}) => {
  const { uiLang } = useUI();
  const isZh = ['zh', 'ja', 'ko'].includes(uiLang);
  const sessionKey = propKey ?? getSessionKey();

  const [tab, setTab] = useState<'friends' | 'requests' | 'ranking' | 'tasks' | 'buddy'>('friends');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [requests, setRequests] = useState<Friend[]>([]);
  const [searchKey, setSearchKey] = useState('');
  const [searchResult, setSearchResult] = useState<{ session_key: string } | null>(null);
  const [searchMsg, setSearchMsg] = useState('');
  const [rankEntries, setRankEntries] = useState<{ session_key: string; xp_earned: number }[]>([]);
  const [jointTasks, setJointTasks] = useState<FriendTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 找学习搭子相关状态
  const [showBuddyFilter, setShowBuddyFilter] = useState(true);
  const [buddyFilter, setBuddyFilter] = useState({
    languages: [] as string[],
    genders: [] as string[],
    distance: 10,
    ageMin: 18,
    ageMax: 60,
  });
  const [buddyResults, setBuddyResults] = useState<BuddyUser[]>([]);
  const [buddyLoading, setBuddyLoading] = useState(false);

  const mockBuddyUsers: BuddyUser[] = [
    { id: 'buddy_1', nickname: '日语爱好者', avatar: '🌸', language: 'ja', gender: 'female', age: 25, distance: 2, level: 12, interests: ['日语学习', '动漫'] },
    { id: 'buddy_2', nickname: '英语学霸', avatar: '📚', language: 'en', gender: 'male', age: 28, distance: 3, level: 18, interests: ['英语学习', '商务英语'] },
    { id: 'buddy_3', nickname: '韩语小达人', avatar: '💖', language: 'ko', gender: 'female', age: 22, distance: 5, level: 10, interests: ['K-pop', '韩剧'] },
    { id: 'buddy_4', nickname: '法语初学者', avatar: '🇫🇷', language: 'fr', gender: 'male', age: 30, distance: 8, level: 5, interests: ['法国文化', '红酒'] },
    { id: 'buddy_5', nickname: '德语学习者', avatar: '🇩🇪', language: 'de', gender: 'male', age: 35, distance: 12, level: 8, interests: ['德国足球', '哲学'] },
    { id: 'buddy_6', nickname: '西语爱好者', avatar: '🌶️', language: 'es', gender: 'female', age: 24, distance: 6, level: 7, interests: ['西班牙美食', '弗拉明戈'] },
    { id: 'buddy_7', nickname: '游戏玩家', avatar: '🎮', language: 'ja', gender: 'male', age: 20, distance: 4, level: 9, interests: ['游戏', '动漫'] },
    { id: 'buddy_8', nickname: '语言探险家', avatar: '🌍', language: 'en', gender: 'female', age: 27, distance: 7, level: 15, interests: ['旅行', '摄影'] },
  ];

  const weekStart = (() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const mon = new Date(new Date().setDate(diff));
    return mon.toISOString().split('T')[0];
  })();

  const loadData = useCallback(async () => {
    setLoading(true);

    if (isOfflineMode()) {
      // Use offline friend data
      const offlineFriends = getFriends();
      setFriends(offlineFriends.filter(f => f.status === 'accepted') as Friend[]);
      setRequests(offlineFriends.filter(f => f.status === 'pending' && !f.is_requester) as Friend[]);
      // Friend ranking from offline weekly data
      const ranks = getWeeklyRanking();
      setRankEntries(ranks.map(r => ({ session_key: r.session_key, xp_earned: r.xp_earned })));
      setLoading(false);
      return;
    }

    const [{ data: sent }, { data: received }] = await Promise.all([
      supabase.from('friendships').select('id, addressee_session_key, status')
        .eq('requester_session_key', sessionKey),
      supabase.from('friendships').select('id, requester_session_key, status')
        .eq('addressee_session_key', sessionKey),
    ]);

    const allFriends: Friend[] = [
      ...(sent ?? []).map((r: { id: string; addressee_session_key: string; status: string }) => ({
        id: r.id,
        other_key: r.addressee_session_key,
        status: r.status,
        is_requester: true,
      })),
      ...(received ?? []).map((r: { id: string; requester_session_key: string; status: string }) => ({
        id: r.id,
        other_key: r.requester_session_key,
        status: r.status,
        is_requester: false,
      })),
    ];

    if (allFriends.length === 0) {
      // Use offline data if no friends from Supabase
      const offlineFriends = getFriends();
      setFriends(offlineFriends.filter(f => f.status === 'accepted') as Friend[]);
      setRequests(offlineFriends.filter(f => f.status === 'pending' && !f.is_requester) as Friend[]);
    } else {
      setFriends(allFriends.filter((f) => f.status === 'accepted'));
      setRequests(allFriends.filter((f) => f.status === 'pending' && !f.is_requester));
    }

    // Friend ranking
    const friendKeys = allFriends.filter((f) => f.status === 'accepted').map((f) => f.other_key);
    if (friendKeys.length > 0) {
      const { data: ranks } = await supabase
        .from('weekly_xp')
        .select('session_key, xp_earned')
        .in('session_key', [...friendKeys, sessionKey])
        .eq('week_start', weekStart)
        .order('xp_earned', { ascending: false });
      setRankEntries((ranks ?? []) as typeof rankEntries);
    } else {
      // Offline ranking
      const ranks = getWeeklyRanking();
      setRankEntries(ranks.map(r => ({ session_key: r.session_key, xp_earned: r.xp_earned })));
    }

    setLoading(false);
  }, [sessionKey, weekStart]);

  useEffect(() => { loadData(); }, [loadData]);

  async function searchUser() {
    const key = searchKey.trim();
    if (!key) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('session_key')
      .eq('session_key', key)
      .maybeSingle();
    if (!data) {
      setSearchResult(null);
      setSearchMsg(isZh ? '用户不存在' : 'User not found');
    } else if (data.session_key === sessionKey) {
      setSearchResult(null);
      setSearchMsg(isZh ? '不能添加自己' : 'Cannot add yourself');
    } else {
      setSearchResult(data as { session_key: string });
      setSearchMsg('');
    }
  }

  async function sendRequest() {
    if (!searchResult) return;
    setSending(true);
    const { error } = await supabase.from('friendships').insert({
      requester_session_key: sessionKey,
      addressee_session_key: searchResult.session_key,
      status: 'pending',
    });
    setSending(false);
    if (error) {
      setSearchMsg(isZh ? '请求已发送或已是好友' : 'Request already sent or already friends');
    } else {
      setSearchMsg(isZh ? '好友申请已发送 ✓' : 'Friend request sent ✓');
      setSearchResult(null);
      setSearchKey('');
    }
  }

  async function acceptRequest(friendship: Friend) {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendship.id);
    // Create a joint task
    await supabase.from('friend_joint_tasks').upsert({
      friendship_id: friendship.id,
      task_date: new Date().toISOString().split('T')[0],
      task_type: 'joint_xp',
      task_label: isZh ? '好友共同获得 100 XP' : 'Earn 100 XP together',
      target_value: 100,
      user1_value: 0,
      user2_value: 0,
      xp_reward: 50,
    }, { onConflict: 'friendship_id,task_date,task_type' });
    loadData();
  }

  async function declineRequest(friendship: Friend) {
    await supabase.from('friendships').update({ status: 'declined' }).eq('id', friendship.id);
    loadData();
  }

  function shortKey(key: string) { return key.slice(-8).toUpperCase(); }

  async function searchBuddies() {
    setBuddyLoading(true);
    try {
      const sk = getSessionKey();
      const { data: realUsers } = await supabase
        .from('user_profiles')
        .select('session_key, nickname, avatar_url, learning_language, gender, age, level')
        .neq('session_key', sk)
        .limit(30);

      if (realUsers && realUsers.length > 0) {
        let results: BuddyUser[] = realUsers.map(u => ({
          id: u.session_key,
          nickname: u.nickname ?? '用户',
          avatar: u.avatar_url ?? '👤',
          language: u.learning_language ?? 'en',
          gender: u.gender ?? 'other',
          age: u.age ?? 25,
          distance: Math.floor(Math.random() * 15) + 1,
          level: u.level ?? 5,
          interests: [],
        }));
        if (buddyFilter.languages.length > 0) results = results.filter(u => buddyFilter.languages.includes(u.language));
        if (buddyFilter.genders.length > 0) results = results.filter(u => buddyFilter.genders.includes(u.gender));
        results = results.filter(u => u.distance <= buddyFilter.distance);
        results = results.filter(u => u.age >= buddyFilter.ageMin && u.age <= buddyFilter.ageMax);
        setBuddyResults(results);
        setBuddyLoading(false);
        return;
      }
    } catch (e) { console.warn('FriendSystem: Supabase查询失败，降级到mock', e); }
    // Fallback to mock
    setTimeout(() => {
      let results = [...mockBuddyUsers];
      if (buddyFilter.languages.length > 0) results = results.filter(u => buddyFilter.languages.includes(u.language));
      if (buddyFilter.genders.length > 0) results = results.filter(u => buddyFilter.genders.includes(u.gender));
      results = results.filter(u => u.distance <= buddyFilter.distance);
      results = results.filter(u => u.age >= buddyFilter.ageMin && u.age <= buddyFilter.ageMax);
      setBuddyResults(results);
      setBuddyLoading(false);
    }, 500);
  }

  function toggleLanguage(langCode: string) {
    const langs = buddyFilter.languages.includes(langCode)
      ? buddyFilter.languages.filter(l => l !== langCode)
      : [...buddyFilter.languages, langCode];
    setBuddyFilter({ ...buddyFilter, languages: langs });
  }

  function toggleGender(gender: string) {
    const genders = buddyFilter.genders.includes(gender)
      ? buddyFilter.genders.filter(g => g !== gender)
      : [...buddyFilter.genders, gender];
    setBuddyFilter({ ...buddyFilter, genders });
  }

  function addBuddy(buddy: BuddyUser) {
    setSearchKey(buddy.id);
    setSearchResult({ session_key: buddy.id });
    setSearchMsg(`找到学习搭子：${buddy.nickname}`);
    setTab('friends');
  }

  return (
    <div className="fs-wrap">
      <FloatingBack onClick={onBack} />
      <div className="fs-header">
        <h1 className="fs-title">{isZh ? '好友系统' : 'Friends'}</h1>
      </div>

      {/* Search */}
      <div className="fs-search-box">
        <input
          className="fs-search-input"
          placeholder={isZh ? '输入好友的 Session Key 搜索' : "Enter friend's Session Key"}
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && searchUser()}
        />
        <button className="fs-search-btn" onClick={searchUser}>{isZh ? '搜索' : 'Search'}</button>
      </div>
      {searchMsg && <div className="fs-search-msg">{searchMsg}</div>}
      {searchResult && (
        <div className="fs-search-result">
          <span>{isZh ? '找到用户：' : 'Found: '}{shortKey(searchResult.session_key)}</span>
          <button className="fs-add-btn" onClick={sendRequest} disabled={sending}>
            {isZh ? '发送申请' : 'Add Friend'}
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="fs-tabs">
        {(['friends', 'requests', 'ranking', 'tasks', 'buddy'] as const).map((t) => (
          <button key={t} className={`fs-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'friends'  ? (isZh ? `好友 (${friends.length})`      : `Friends (${friends.length})`)   : ''}
            {t === 'requests' ? (isZh ? `申请 (${requests.length})`      : `Requests (${requests.length})`) : ''}
            {t === 'ranking'  ? (isZh ? '好友榜'                         : 'Ranking')                       : ''}
            {t === 'tasks'    ? (isZh ? '共同任务'                       : 'Joint Tasks')                   : ''}
            {t === 'buddy'    ? (isZh ? '找学习搭子'                     : 'Find Buddy')                    : ''}
          </button>
        ))}
      </div>

      {loading ? <div className="fs-loading">⏳</div> : (
        <div className="fs-body">
          {tab === 'friends' && (
            friends.length === 0
              ? <div className="fs-empty">{isZh ? '还没有好友，快去搜索添加吧！' : 'No friends yet — search to add some!'}</div>
              : friends.map((f) => (
                <div key={f.id} className="fs-friend-card">
                  <span className="fs-friend-avatar">👤</span>
                  <span className="fs-friend-name">{shortKey(f.other_key)}</span>
                  <span className="fs-friend-tag">{isZh ? '好友' : 'Friend'}</span>
                </div>
              ))
          )}

          {tab === 'requests' && (
            requests.length === 0
              ? <div className="fs-empty">{isZh ? '暂无好友申请' : 'No pending requests'}</div>
              : requests.map((f) => (
                <div key={f.id} className="fs-request-card">
                  <span className="fs-friend-name">{shortKey(f.other_key)}</span>
                  <div className="fs-request-actions">
                    <button className="fs-accept-btn" onClick={() => acceptRequest(f)}>{isZh ? '同意' : 'Accept'}</button>
                    <button className="fs-decline-btn" onClick={() => declineRequest(f)}>{isZh ? '拒绝' : 'Decline'}</button>
                  </div>
                </div>
              ))
          )}

          {tab === 'ranking' && (
            rankEntries.length === 0
              ? <div className="fs-empty">{isZh ? '好友排行榜需要至少一位好友' : 'Add friends to see ranking'}</div>
              : rankEntries.map((r, i) => (
                <div key={r.session_key} className={`fs-rank-entry ${r.session_key === sessionKey ? 'mine' : ''}`}>
                  <span className="fs-rank-pos">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}</span>
                  <span className="fs-rank-name">{r.session_key === sessionKey ? (isZh ? '我' : 'Me') : shortKey(r.session_key)}</span>
                  <span className="fs-rank-xp">{r.xp_earned} XP</span>
                </div>
              ))
          )}

          {tab === 'tasks' && (
            jointTasks.length === 0
              ? <div className="fs-empty">{isZh ? '同意好友申请后将自动创建共同任务' : 'Accept a friend request to get joint tasks'}</div>
              : jointTasks.map((t) => (
                <div key={t.id} className={`fs-task-card ${t.completed ? 'done' : ''}`}>
                  <div className="fs-task-label">{t.task_label}</div>
                  <div className="fs-task-progress">
                    {isZh ? `你: ${t.user1_value}` : `You: ${t.user1_value}`} · {isZh ? `好友: ${t.user2_value}` : `Friend: ${t.user2_value}`}
                    {' / '}{t.target_value}
                  </div>
                  {t.completed && <span className="fs-task-done">✓ +{t.xp_reward} XP</span>}
                </div>
              ))
          )}

          {tab === 'buddy' && (
            <div className="fs-buddy-section">
              <div className="fs-buddy-filter-header">
                <button 
                  className="fs-buddy-filter-toggle" 
                  onClick={() => setShowBuddyFilter(!showBuddyFilter)}
                >
                  {showBuddyFilter ? '▼ 收起筛选' : '▲ 展开筛选'}
                </button>
              </div>
              
              {showBuddyFilter && (
                <div className="fs-buddy-filters">
                  <div className="fs-buddy-filter-group">
                    <label className="fs-buddy-filter-label">🎯 学习语言</label>
                    <div className="fs-buddy-filter-options">
                      {LANGUAGES.map(lang => (
                        <button
                          key={lang.code}
                          className={`fs-buddy-filter-option ${buddyFilter.languages.includes(lang.code) ? 'selected' : ''}`}
                          onClick={() => toggleLanguage(lang.code)}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fs-buddy-filter-group">
                    <label className="fs-buddy-filter-label">👫 性别</label>
                    <div className="fs-buddy-filter-options">
                      <button
                        className={`fs-buddy-filter-option ${buddyFilter.genders.includes('male') ? 'selected' : ''}`}
                        onClick={() => toggleGender('male')}
                      >
                        男
                      </button>
                      <button
                        className={`fs-buddy-filter-option ${buddyFilter.genders.includes('female') ? 'selected' : ''}`}
                        onClick={() => toggleGender('female')}
                      >
                        女
                      </button>
                    </div>
                  </div>

                  <div className="fs-buddy-filter-group">
                    <label className="fs-buddy-filter-label">📍 距离范围</label>
                    <div className="fs-buddy-filter-options">
                      {DISTANCE_RANGES.map(dist => (
                        <button
                          key={dist.value}
                          className={`fs-buddy-filter-option ${buddyFilter.distance === dist.value ? 'selected' : ''}`}
                          onClick={() => setBuddyFilter({ ...buddyFilter, distance: dist.value })}
                        >
                          {dist.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="fs-buddy-filter-group">
                    <label className="fs-buddy-filter-label">🎂 年龄段</label>
                    <div className="fs-buddy-age-range">
                      <input
                        type="number"
                        className="fs-buddy-age-input"
                        min="1"
                        max="100"
                        value={buddyFilter.ageMin}
                        onChange={(e) => setBuddyFilter({ ...buddyFilter, ageMin: parseInt(e.target.value) || 1 })}
                        placeholder="最小年龄"
                      />
                      <span className="fs-buddy-age-separator">~</span>
                      <input
                        type="number"
                        className="fs-buddy-age-input"
                        min="1"
                        max="100"
                        value={buddyFilter.ageMax}
                        onChange={(e) => setBuddyFilter({ ...buddyFilter, ageMax: parseInt(e.target.value) || 100 })}
                        placeholder="最大年龄"
                      />
                    </div>
                  </div>

                  <button className="fs-buddy-search-btn" onClick={searchBuddies}>
                    🔍 搜索学习搭子
                  </button>
                </div>
              )}

              <div className="fs-buddy-results">
                {buddyLoading ? (
                  <div className="fs-buddy-loading">⏳ 搜索中...</div>
                ) : buddyResults.length === 0 ? (
                  <div className="fs-empty">
                    {isZh ? '没有找到符合条件的学习搭子' : 'No buddies found matching your criteria'}
                  </div>
                ) : (
                  buddyResults.map(buddy => (
                    <div key={buddy.id} className="fs-buddy-card">
                      <span className="fs-buddy-avatar">{buddy.avatar}</span>
                      <div className="fs-buddy-info">
                        <span className="fs-buddy-name">{buddy.nickname}</span>
                        <span className="fs-buddy-meta">
                          {LANGUAGES.find(l => l.code === buddy.language)?.name} · Lv.{buddy.level} · {buddy.distance}km
                        </span>
                        <div className="fs-buddy-interests">
                          {buddy.interests.slice(0, 2).map((interest, idx) => (
                            <span key={idx} className="fs-buddy-tag">{interest}</span>
                          ))}
                        </div>
                      </div>
                      <button className="fs-buddy-add-btn" onClick={() => addBuddy(buddy)}>
                        {isZh ? '加为好友' : 'Add'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
