"use client";

import { useState } from "react";

type Props = {
  id: string;
  companyName: string;
  status: string;
  deadline: string | null;
  mypageUrl: string | null;
  loginId: string | null;
  loginPassword: string | null;
  memo: string | null;
  onDelete: () => void;
  onUpdate: (
    id: string,
    companyName: string,
    status: string,
    deadline: string,
    mypageUrl: string,
    loginId: string,
    loginPassword: string,
    memo: string
  ) => void;
};

const getRemainingDays = (deadline: string | null) => {
  if (!deadline) return null;

  const today = new Date();
  const targetDate = new Date(deadline);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const getCardStyle = (remainingDays: number | null) => {
  if (remainingDays === null) {
    return "border-gray-300 bg-white";
  }

  if (remainingDays < 0) {
    return "border-gray-400 bg-gray-50";
  }

  if (remainingDays <= 4) {
    return "border-red-500 bg-red-50";
  }

  if (remainingDays <= 7) {
    return "border-orange-400 bg-orange-50";
  }

  return "border-green-500 bg-green-50";
};

const getWarningLabel = (remainingDays: number | null) => {
  if (remainingDays === null) return null;

  if (remainingDays < 0) {
    return "期限切れ";
  }

  if (remainingDays <= 7) {
    return "⚠ 締切間近！";
  }

  return null;
};

export default function CompanyCard({
  id,
  companyName,
  status,
  deadline,
  mypageUrl,
  loginId,
  loginPassword,
  memo,
  onDelete,
  onUpdate,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [editCompanyName, setEditCompanyName] = useState(companyName);
  const [editStatus, setEditStatus] = useState(status);
  const [editDeadline, setEditDeadline] = useState(deadline ?? "");
  const [editMypageUrl, setEditMypageUrl] = useState(mypageUrl ?? "");
  const [editLoginId, setEditLoginId] = useState(loginId ?? "");
  const [editLoginPassword, setEditLoginPassword] = useState(
    loginPassword ?? ""
  );
  const [editMemo, setEditMemo] = useState(memo ?? "");

  const remainingDays = getRemainingDays(deadline);
  const warningLabel = getWarningLabel(remainingDays);

  const handleUpdate = () => {
    onUpdate(
      id,
      editCompanyName,
      editStatus,
      editDeadline,
      editMypageUrl,
      editLoginId,
      editLoginPassword,
      editMemo
    );

    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded-xl p-4 mb-4 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <input
            className="border p-3 rounded w-full"
            placeholder="企業名"
            value={editCompanyName}
            onChange={(e) => setEditCompanyName(e.target.value)}
          />

          <select
            className="border p-3 rounded w-full"
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="未応募">未応募</option>
            <option value="ES提出">ES提出</option>
            <option value="一次面接">一次面接</option>
            <option value="最終面接">最終面接</option>
            <option value="内定">内定</option>
            <option value="落選">落選</option>
          </select>

          <input
            className="border p-3 rounded w-full"
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="企業マイページURL"
            value={editMypageUrl}
            onChange={(e) => setEditMypageUrl(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="ログインID"
            value={editLoginId}
            onChange={(e) => setEditLoginId(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="ログインパスワード"
            value={editLoginPassword}
            onChange={(e) => setEditLoginPassword(e.target.value)}
          />

          <textarea
            className="border p-3 rounded w-full md:col-span-2 lg:col-span-3"
            placeholder="メモ"
            value={editMemo}
            onChange={(e) => setEditMemo(e.target.value)}
          />
        </div>

        <div className="mt-3 flex gap-2">
          <button
            className="border px-4 py-2 rounded"
            onClick={handleUpdate}
          >
            保存
          </button>

          <button
            className="border px-4 py-2 rounded"
            onClick={() => setIsEditing(false)}
          >
            キャンセル
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-xl p-4 mb-4 ${getCardStyle(
        remainingDays
      )}`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold break-words">{companyName}</h3>

          <p>選考状況：{status}</p>

          <p>
            締切日：{deadline ?? "未設定"}
            {remainingDays !== null && (
              <span
                className={
                  remainingDays <= 7 && remainingDays >= 0
                    ? "text-red-600 font-bold ml-2"
                    : "text-green-600 font-bold ml-2"
                }
              >
                {remainingDays < 0
                  ? `（${Math.abs(remainingDays)}日超過）`
                  : `（残り ${remainingDays} 日）`}
              </span>
            )}
          </p>

          <p className="break-words">
            マイページ：
            {mypageUrl ? (
              <a
                className="text-blue-600 underline break-all"
                href={mypageUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {mypageUrl}
              </a>
            ) : (
              "未設定"
            )}
          </p>

          <p className="break-words">ログインID：{loginId ?? "未設定"}</p>
          <p className="break-words">
            パスワード：{loginPassword ?? "未設定"}
          </p>
          <p className="break-words whitespace-pre-wrap">
            メモ：{memo ?? "未設定"}
          </p>
        </div>

        {warningLabel && (
          <div className="shrink-0 bg-red-600 text-white text-sm font-bold px-3 py-2 rounded">
            {warningLabel}
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-2 justify-end">
        <button
          className="border px-4 py-2 rounded bg-white"
          onClick={() => setIsEditing(true)}
        >
          編集
        </button>

        <button
          className="border border-red-500 text-red-600 px-4 py-2 rounded bg-white"
          onClick={onDelete}
        >
          削除
        </button>
      </div>
    </div>
  );
}