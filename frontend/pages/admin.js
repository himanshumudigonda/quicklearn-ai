import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Activity, Database, Zap, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [topTopics, setTopTopics] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, topicsRes, jobsRes] = await Promise.all([
        axios.get(`${API_URL}/api/admin/stats`, {
          headers: { 'X-Admin-Token': adminToken }
        }),
        axios.get(`${API_URL}/api/admin/top-topics?limit=50`, {
          headers: { 'X-Admin-Token': adminToken }
        }),
        axios.get(`${API_URL}/api/admin/recent-jobs?limit=30`, {
          headers: { 'X-Admin-Token': adminToken }
        }),
      ]);

      setStats(statsRes.data);
      setTopTopics(topicsRes.data.topics);
      setRecentJobs(jobsRes.data.jobs);
      setAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      if (error.response?.status === 403) {
        setAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setLoading(true);
    fetchData();
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAdminToken(token);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated && adminToken) {
      localStorage.setItem('admin_token', adminToken);
      const interval = setInterval(fetchData, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [authenticated, adminToken]);

  if (!authenticated && !loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              placeholder="Enter admin token"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="input mb-4"
            />
            <button type="submit" className="btn-primary w-full">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - QuickLearn AI</title>
      </Head>

      <div className="min-h-screen bg-neutral-100">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              QuickLearn AI <span className="text-primary-500">Admin</span>
            </h1>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                setAuthenticated(false);
              }}
              className="btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Database className="w-6 h-6" />}
              title="Total Users"
              value={stats?.database?.users || 0}
              color="blue"
            />
            <StatCard
              icon={<Activity className="w-6 h-6" />}
              title="Explanations"
              value={stats?.database?.explanations || 0}
              color="green"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Verified"
              value={stats?.database?.verified || 0}
              color="purple"
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              title="Cache Keys"
              value={stats?.cache?.keys || 0}
              color="orange"
            />
          </div>

          {/* Model Usage */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary-500" />
              Model Usage (24h)
            </h2>
            <div className="space-y-3">
              {stats?.models && Object.entries(stats.models).map(([model, count]) => (
                <div key={model} className="flex items-center justify-between">
                  <span className="font-mono text-sm">{model}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-neutral-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${Math.min((count / 1000) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold w-16 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Topics */}
          <div className="card mb-8">
            <h2 className="text-xl font-bold mb-4">Top 50 Topics</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">#</th>
                    <th className="text-left py-2 px-3">Topic</th>
                    <th className="text-right py-2 px-3">Uses</th>
                    <th className="text-center py-2 px-3">Verified</th>
                    <th className="text-left py-2 px-3">Model</th>
                  </tr>
                </thead>
                <tbody>
                  {topTopics.map((topic, index) => (
                    <tr key={topic.topic} className="border-b hover:bg-neutral-50">
                      <td className="py-2 px-3 text-neutral-500">{index + 1}</td>
                      <td className="py-2 px-3 font-medium capitalize">{topic.topic}</td>
                      <td className="py-2 px-3 text-right font-semibold">{topic.uses}</td>
                      <td className="py-2 px-3 text-center">
                        {topic.verified ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mx-auto" />
                        ) : (
                          <span className="text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-sm font-mono text-neutral-600">
                        {topic.source_model}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-primary-500" />
              Recent Verification Jobs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">Job ID</th>
                    <th className="text-left py-2 px-3">Topic</th>
                    <th className="text-center py-2 px-3">Status</th>
                    <th className="text-left py-2 px-3">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-neutral-50">
                      <td className="py-2 px-3 font-mono text-xs">{job.id.slice(0, 8)}</td>
                      <td className="py-2 px-3 capitalize">{job.topic}</td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          job.status === 'completed' ? 'bg-green-100 text-green-800' :
                          job.status === 'failed' ? 'bg-red-100 text-red-800' :
                          job.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-sm text-neutral-600">
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-neutral-600">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
