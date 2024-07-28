'use client';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  deleteConversation,
  fetchDocumentList,
  createConversation,
  updateConversation,
} from '@/lib/api';
import { Document, ConversationCreate, Conversation } from '@/types';
import { useStoreDisplaySettings } from '@/store';
import { SidebarEntry } from '@/types';
import {
  PlusCircle,
  ChatCircleDots,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react';
import FileUpload from './FileUpload';

interface SidebarProps {
  chats: SidebarEntry[] | [];
}

export const Sidebar: React.FC<SidebarProps> = ({ chats }: SidebarProps) => {
  const { isSidebarExpanded } = useStoreDisplaySettings();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [renameTitle, setRenameTitle] = useState<string | null>(null);
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: documentsList, isLoading: isLoadingDocs } = useQuery<
    Document[]
  >({
    queryKey: ['documents-list'],
    queryFn: () => fetchDocumentList(),
    retry: false,
  });

  const addConversation = useMutation<Conversation, any, ConversationCreate>({
    mutationFn: (data) => createConversation(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['side-bar-entries'],
      });
      setShowCreateModal(false);

      router.push(`/conversations/${data.id}`);
    },
  });

  useEffect(() => {
    if (chats.length === 0) {
      router.push('/conversations');
      return;
    }

    const pathParts = pathname.split('/');
    const id = pathParts.length > 2 ? pathParts[2] : null;

    if (id && typeof id === 'string') {
      const chatExists = chats.some((chat) => chat.id === id);
      if (chatExists) {
        setSelectedChat(id);
      } else {
        router.push(`/conversations/${chats[0].id}`);
      }
    }
  }, [pathname, chats, router]);

  useEffect(() => {
    const createModal = document.getElementById(
      'create_modal'
    ) as HTMLDialogElement;
    if (showCreateModal) {
      createModal?.showModal();
    } else {
      createModal?.close();
    }
  }, [showCreateModal]);

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      setShowModal(null);
      queryClient.invalidateQueries({
        queryKey: ['side-bar-entries'],
      });
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const handleCreate = async () => {
    if (!selectedFile) {
      return;
    }
    const values = {
      title: title || '',
      filename: selectedFile,
    };
    setSelectedFile(null);
    setTitle(null);
    addConversation.mutate(values);
  };

  const handleRename = async (id: string) => {
    if (!renameTitle) {
      return;
    }
    try {
      await updateConversation(id, { title: renameTitle });
      setShowRenameModal(null);
      queryClient.invalidateQueries({
        queryKey: ['side-bar-entries'],
      });
    } catch (error) {
      console.error('Error renaming conversation:', error);
    }
  };

  useEffect(() => {
    const modal = document.getElementById('my_modal_5') as HTMLDialogElement;
    if (showModal) {
      modal?.showModal();
    } else {
      modal?.close();
    }
  }, [showModal]);

  useEffect(() => {
    const renameModal = document.getElementById(
      'rename_modal'
    ) as HTMLDialogElement;
    if (showRenameModal) {
      renameModal?.showModal();
    } else {
      renameModal?.close();
    }
  }, [showRenameModal]);

  return (
    <>
      <div
        className={`z-10 w-full h-screen overflow-scroll p-4 bg-base-100 scroll-hidden rounded-r-lg ease-in-out duration-100 shadow-lg ${
          isSidebarExpanded ? 'translate-x-[-100%]' : 'translate-x-0'
        }`}
      >
        <button
          className="w-full border-dashed border-white border btn btn-ghost mb-4 flex items-center justify-center shadow-md hover:shadow-lg"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle className="mr-2 w-4 h-4" />
          New Chat
        </button>
        <dialog id="create_modal" className="modal">
          <div className="modal-box w-[25rem]">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setShowCreateModal(false)}
            >
              ✕
            </button>
            <h3 className="font-bold text-lg">Start a new conversation</h3>
            <div className="w-full max-w-xs mt-8">
              {isLoadingDocs ? (
                <div className="flex justify-center items-center">
                  <span className="loading loading-spinner loading-xs"></span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 w-[10.5 rem]">
                      <span className="font-bold w-[3.5rem]">Title:</span>
                      <input
                        type="text"
                        placeholder="Insert a conversation title"
                        className="input input-bordered input-sm w-full max-w-xs"
                        value={title || ''}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="flex items-start gap-2  w-[17.5 rem]">
                      <span className="font-bold w-[3.5rem]">File:</span>
                      <div className="flex w-full">
                        <select
                          className="select select-bordered select-sm"
                          value={selectedFile || ''}
                          onChange={(e) => setSelectedFile(e.target.value)}
                        >
                          <option disabled value="">
                            Select file to chat with
                          </option>
                          {documentsList?.map((doc) => (
                            <option key={doc.filename} value={doc.filename}>
                              {doc.filename}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="divider">OR</div>
                    <div className="ml-2 w-[17.5 rem] mt-2 mb-4">
                      <FileUpload setSelectedFile={setSelectedFile} />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-2">
              <button
                className="btn btn-primary"
                disabled={!title || !selectedFile}
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </dialog>

        <div className="flex max-h-screen overflow-scroll pb-20 flex-col gap-2 scroll-hidden">
          {chats.map((chat) => (
            <div key={chat.id} className="relative group">
              <div>
                <div
                  className={`z-0 rounded-lg p-2 flex items-center btn btn-ghost w-full shadow-md hover:shadow-lg ${
                    chat.id === selectedChat ? 'bg-base-200 ' : 'hover:bg-base'
                  } cursor-pointer`}
                  onClick={() => {
                    setSelectedChat(chat.id);
                    router.push(`/conversations/${chat.id}`);
                  }}
                >
                  <ChatCircleDots className="mr-2 w-4 h-4" />
                  <p className="flex-1 text-left overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                    {chat.title}
                  </p>
                  <div className="flex flex-row gap-2 dropdown dropdown-left dropdown-bottom z-1000">
                    <div
                      tabIndex={0}
                      role="button"
                      className=" p-0 opacity-0 group-hover:opacity-100 shadow-md hover:shadow-lg ml-auto z-1000"
                    >
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowRenameModal(chat.id);
                          setRenameTitle(chat.title);
                        }}
                      >
                        <PencilSimple className="w-4 h-4" />
                      </a>
                    </div>
                    <div
                      tabIndex={0}
                      role="button"
                      className=" p-0 opacity-0 group-hover:opacity-100 shadow-md hover:shadow-lg ml-auto z-1000"
                    >
                      <a onClick={() => setShowModal(chat.id)}>
                        <Trash className="w-4 h-4 text-error" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box shadow-lg">
          <h3 className="font-bold text-lg">Confirm Delete</h3>
          <p className="py-4">
            Are you sure you want to delete this conversation?
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowModal(null)}>
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={() => handleDelete(showModal!)}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>

      <dialog id="rename_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box shadow-lg">
          <h3 className="font-bold text-lg">Rename Conversation</h3>
          <div className="py-4">
            <input
              type="text"
              placeholder="New conversation title"
              className="input input-bordered w-full"
              value={renameTitle || ''}
              onChange={(e) => setRenameTitle(e.target.value)}
            />
          </div>
          <div className="modal-action">
            <button className="btn" onClick={() => setShowRenameModal(null)}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={() => handleRename(showRenameModal!)}
            >
              Save
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Sidebar;
