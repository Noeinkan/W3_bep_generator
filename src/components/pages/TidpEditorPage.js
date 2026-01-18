import React from 'react';
import { useParams } from 'react-router-dom';
import TidpMidpManager from './tidp-midp/TidpMidpManager';

const TidpEditorPage = () => {
  // Use React Router's useParams to extract the id from the URL
  const { id } = useParams();
  // id may be in the form "id--slug"; manager expects the id or id--slug but will extract id itself
  const initialTidpId = id || null;

  return (
    <div data-page-uri={initialTidpId ? `/tidp-editor/${initialTidpId}` : '/tidp-editor'}>
      <TidpMidpManager initialShowTidpForm={true} initialTidpId={initialTidpId} />
    </div>
  );
};

export default TidpEditorPage;