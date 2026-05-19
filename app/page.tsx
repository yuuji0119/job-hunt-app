"use client";

import { useEffect, useState } from "react";
import CompanyCard from "./components/CompanyCard";
import { supabase } from "../lib/supabase";

type Company = {
  id: string;
  company_name: string;
  status: string;
  deadline: string | null;
};

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [status, setStatus] = useState("未応募");
  const [deadline, setDeadline] = useState("");

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setCompanies(data);
  };

  const addCompany = async () => {
    if (companyName === "") {
      alert("企業名を入力してください");
      return;
    }

    const { error } = await supabase.from("companies").insert({
      company_name: companyName,
      status: status,
      deadline: deadline === "" ? null : deadline,
    });

    if (error) {
      console.error(error);
      alert("保存失敗");
      return;
    }

    setCompanyName("");
    setStatus("未応募");
    setDeadline("");
    fetchCompanies();
  };

  const deleteCompany = async (id: string) => {
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("削除失敗");
      return;
    }

    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold">就活管理アプリ</h1>

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
            companyName={company.company_name}
            status={company.status}
            deadline={company.deadline}
            onDelete={() => deleteCompany(company.id)}
          />
        ))}
      </div>
    </div>
  );
}