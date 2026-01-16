"use client";
import AiModelList from "@/shared/AiModelList";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader, Lock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AiSelectedModelContext } from "@/context/AiSelectedModelContext";
import { useAuth, useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DefaultModel } from "@/shared/AiModelsShared";

function AiMultiModels() {
  const { user } = useUser();
  const [aiModelList, setAiModelList] = useState(AiModelList);
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);
  const { has } = useAuth();
  const canUseUnlimited = typeof has === "function" && has({ plan: "unlimited_plan" });


useEffect(() => {
  setAiModelList((prev) =>
    prev.map((m) => ({
      ...m,
      enable: aiSelectedModels[m.model]?.enable ?? m.enable,  
    }))
  );
}, [aiSelectedModels]);  
  const onToggleChange = (model, value) => {
    setAiModelList((prev) =>
      prev.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
    setAiSelectedModels((prev) => {
      const updatedModel = {
        ...(prev?.[model] ?? {
          modelId: DefaultModel[model]?.modelId || `${model}-default`,
        }),
        enable: value,
      };
      const newState = {
        ...prev,
        [model]: updatedModel,
      };

      if (user?.primaryEmailAddress?.emailAddress) {
        const docRef = doc(db, "users", user.primaryEmailAddress.emailAddress);

        updateDoc(docRef, {
          selectedModelPref: newState,
        }).catch((err) => console.error("Failed to save toggle:", err));
      }

      return newState;
    });
  };

  const onSelectValue = async (parentModel, value) => {
    setAiSelectedModels((prev) => {
      const updatedModel = {
        ...prev[parentModel],
        modelId: value,
      };

      const newState = {
        ...prev,
        [parentModel]: updatedModel,
      };

      const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);

      updateDoc(docRef, {
        selectedModelPref: newState,
      }).catch((err) => console.error("Save failed:", err));

      return newState;
    });
  };

  return (
    <div className="flex flex-1 h-[65vh] border-b">
      {aiModelList.map((model, index) => (
        <div
          key={index}
          className={`flex flex-col border overflow-auto h-full ${
            model.enable ? "flex-1 min-w-100" : "w-25 flex-none"
          }`}
        >
          <div className="flex w-full h-17.5 items-center justify-between border-b p-4">
            <div className="flex items-center gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                width={24}
                height={24}
              />
              {canUseUnlimited && model.enable && (
                <Select
                  defaultValue={aiSelectedModels[model.model]?.modelId}
                  disabled={model.premium && !canUseUnlimited}
                  onValueChange={(value) => onSelectValue(model.model, value)}
                >
                  <SelectTrigger className="w-45">
                    <SelectValue
                      placeholder={aiSelectedModels[model.model]?.modelId}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel>Free</SelectLabel>
                      {model.subModel.map(
                        (subModel, index) =>
                          subModel.premium === false && (
                            <SelectItem key={index} value={subModel.id}>
                              {subModel.name}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
                    <SelectGroup className="px-3">
                      <SelectLabel>Premium</SelectLabel>
                      {model.subModel.map(
                        (subModel, index) =>
                          subModel.premium === true && (
                            <SelectItem
                              key={index}
                              value={subModel.id}
                              disabled={model.premium && !canUseUnlimited}
                            >
                              {subModel.name}{" "}
                              {subModel.premium && <Lock className="h-4 w-4" />}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(v) => onToggleChange(model.model, v)}
                />
              ) : (
                <MessageSquare
                  onClick={() => onToggleChange(model.model, true)}
                />
              )}
            </div>
          </div>
          {!canUseUnlimited && model.premium && model.enable && (
            <div className="flex items-center justify-center h-full">
              <Button>
                {" "}
                <Lock />
                Upgrade to unlock
              </Button>
            </div>
          )}
          {model.enable && aiSelectedModels[model.model]?.enable && (!model.premium || canUseUnlimited) && (
            <div className="flex-1 p-4">
              <div className="flex-1 space-y-2 p-4">
                {messages[model.model]?.map((m, i) => (
                  <div
                    className={`p-2 rounded-md ${
                      m.role === "user"
                        ? "bg-blue-100 text-blue-900"
                        : "text-gray-900 bg-gray-100"
                    }`}
                    key={i}
                  >
                    {m.role === "assistant" && (
                      <span className="text-sm text-gray-400">
                        {m.model ?? model.model}
                      </span>
                    )}
                    <div className="flex gap-3 items-center">
                      {m.content === "loading" && (
                        <>
                          <Loader className="animate-spin" />
                          <span>Thinking...</span>
                        </>
                      )}
                      {m?.content !== "loading" && (
                        m?.content && <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {m?.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default AiMultiModels;
