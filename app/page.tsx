"use client";

import { useEffect, useState } from "react";
import CompanyCard from "./components/CompanyCard";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

type Company = {
 id: string;
  company_name: string;
  status: string;
  deadline: string | null;
  user_id: string | null;
  mypage_url: string | null;
  login_id: string | null;
  login_password: string | null;
  memo: string | null;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("未応募");
  const [deadline, setDeadline] = useState("");
  const [mypageUrl, setMypageUrl] = useState("");

  const fetchCompanies = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCompanies([]);
      return;
    }

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("user_id", user.id)
      .order("deadline", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setCompanies(data ?? []);
  };

  const signUp = async () => {
    if (email === "" || password === "") {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("登録しました。確認メールが届いた場合は確認してください。");
  };

  const signIn = async () => {
    if (email === "" || password === "") {
      alert("メールアドレスとパスワードを入力してください");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setUser(data.user);
    fetchCompanies();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCompanies([]);
  };

  const addCompany = async () => {
    if (!user) {
      alert("ログインしてください");
      return;
    }

    if (companyName === "") {
      alert("企業名を入力してください");
      return;
    }

    const { error } = await supabase.from("companies").insert({
      company_name: companyName,
      status: status,
      deadline: deadline === "" ? null : deadline,
      user_id: user.id,
      mypage_url: mypageUrl === "" ? null : mypageUrl,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setCompanyName("");
    setStatus("未応募");
    setDeadline("");
    setMypageUrl("");
    fetchCompanies();
  };

  const deleteCompany = async (id: string) => {
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchCompanies();
  };

  const updateCompany = async (
    id: string,
    companyName: string,
    status: string,
    deadline: string,
    mypageUrl: string
  ) => {
    const { error } = await supabase
      .from("companies")
      .update({
        company_name: companyName,
        status: status,
        deadline: deadline === "" ? null : deadline,
        mypage_url: mypageUrl === "" ? null : mypageUrl,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchCompanies();
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchCompanies();
      } else {
        setCompanies([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchCompanies();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-10">
        <h1 className="text-4xl font-bold">就活管理アプリ</h1>

        <div className="mt-6 border rounded-xl p-4 max-w-md">
          <h2 className="text-2xl font-bold mb-4">ログイン</h2>

          <input
            className="border p-2 w-full mb-3"
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-3"
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="border px-4 py-2 rounded mr-2"
            onClick={signIn}
          >
            ログイン
          </button>

          <button
            className="border px-4 py-2 rounded"
            onClick={signUp}
          >
            新規登録
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">就活管理アプリ</h1>

        <button
          className="border px-4 py-2 rounded"
          onClick={signOut}
        >
          ログアウト
        </button>
      </div>

      <p className="mt-2 text-sm text-gray-600">
        ログイン中：{user.email}
      </p>

      <div className="mt-6 border rounded-xl p-4">
        <h2 className="text-2xl font-bold mb-4">企業追加</h2>

        <input
          className="border p-2 mr-2"
          placeholder="企業名"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <select
          className="border p-2 mr-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="未応募">未応募</option>
          <option value="ES提出">ES提出</option>
          <option value="一次面接">一次面接</option>
          <option value="最終面接">最終面接</option>
          <option value="内定">内定</option>
          <option value="落選">落選</option>
        </select>

        <input
          className="border p-2 mr-2"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <input
          className="border p-2 mr-2 mt-2"
          placeholder="企業マイページURL"
          value={mypageUrl}
          onChange={(e) => setMypageUrl(e.target.value)}
        />

        <button
          className="border px-4 py-2 rounded"
          onClick={addCompany}
        >
          追加
        </button>
      </div>

      <div className="mt-6">
        {companies.map((company) => (
          <CompanyCard
            key={company.id}
            id={company.id}
            companyName={company.company_name}
            status={company.status}
            deadline={company.deadline}
            mypageUrl={company.mypage_url}
            loginId={company.login_id}
            loginPassword={company.login_password}
            memo={company.memo}
            onDelete={() => deleteCompany(company.id)}
            onUpdate={updateCompany}
          />
        ))}
      </div>
    </div>
  );
}