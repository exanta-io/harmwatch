'use client';
import React from 'react';

const UserGuide = () => {
  return (
    <div className="p-8 max-w-4xl max-h-screen mx-auto h-[50rem] bg-base-100 shadow-lg overflow-y-auto rounded-lg">
      <h2 className="text-2xl font-extrabold text-sky text-center mb-6">
        HarmWatch User Guide
      </h2>
      <p className="mb-6 text-neutral-content leading-relaxed">
        Welcome to <strong className="text-sky">HarmWatch!</strong> This guide
        will help you get started with using this web-app to have insightful
        conversations with your PDFs. Follow the steps below to begin:
      </p>

      <h3 className="text-xl font-semibold text-sky mt-8 mb-4">
        Starting a New Chat
      </h3>
      <ol className="list-decimal ml-6 space-y-4 text-neutral-content leading-relaxed">
        <li>
          <div className="flex items-start">
            <div>
              <strong>Press the &apos;New Chat&apos; Button:</strong>
              <p>
                Locate the &apos;New Chat&apos; button at the top of the sidebar. Click on
                it to initiate a new conversation.
              </p>
            </div>
          </div>
        </li>
        <li>
          <strong>Provide a Title:</strong>
          <p>
            A prompt will appear asking you to give a title to your new chat.
            Enter a descriptive title that helps you remember the purpose of
            this conversation.
          </p>
        </li>
        <li>
          <strong>Select an Existing PDF:</strong>
          <p>
            You will see a list of available PDFs that have already been
            uploaded to the application. Choose one from this list that you want
            to base your conversation on.
          </p>
        </li>
        <li>
          <strong>Upload Your Own PDF:</strong>
          <p>
            If you prefer to use a new PDF, click on the &apos;Upload PDF&apos; option.
            Select a PDF file from your device (note: the file must not exceed
            10 MB).
          </p>
        </li>
        <li>
          <strong>Create the Conversation:</strong>
          <p>
            After setting the title and selecting/uploading a PDF, click on the
            &apos;Create&apos; button. This action will start a new conversation connected
            to the selected PDF.
          </p>
        </li>
      </ol>

      <h3 className="text-xl font-semibold text-sky mt-8 mb-4">
        Managing Conversations
      </h3>
      <ul className="list-disc ml-6 space-y-4 text-neutral-content leading-relaxed">
        <li>
          <div className="flex items-start">
            <div>
              <strong>View Older Conversations:</strong>
              <p>
                All your previous conversations are listed in the sidebar. Click
                on any conversation to access it.
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-start">
            <div>
              <strong>Rename a Conversation:</strong>
              <p>
                To rename a conversation, hover over it on the sidebar and click
                on the rename icon (pencil symbol) and enter the new title.
              </p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-start">
            <div>
              <strong>Delete a Conversation:</strong>
              <p>
                To delete a conversation, hover over it on the sidebar and click
                on the delete icon (trash can symbol).
              </p>
            </div>
          </div>
        </li>
      </ul>

      <h3 className="text-xl font-semibold text-sky mt-8 mb-4">
        Engaging in Conversations
      </h3>
      <p className="text-neutral-content leading-relaxed">
        Once a conversation is created, you can ask questions related to the
        content of the PDF. The application will use the context from the PDF to
        generate accurate and relevant answers. Feel free to create multiple
        conversations for different PDFs or multiple chats for the same PDF to
        keep your discussions organized.
      </p>

      <p className="mt-8 text-neutral-content leading-relaxed">
        By following this guide, you&apos;ll be able to efficiently use the
        application to interact with your PDFs and extract valuable information.
        Enjoy exploring the possibilities with{' '}
        <strong className="text-sky">HarmWatch!</strong>
      </p>
    </div>
  );
};

export default UserGuide;
