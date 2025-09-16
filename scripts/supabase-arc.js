// Supabase operations for ARC site (photos)
if (typeof window.supabase === 'undefined') {
  // Create a mock supabase object if not available
  window.supabase = {
    from: () => ({
      select: () => ({ 
        eq: () => ({ 
          or: () => ({ 
            order: () => ({ data: [], error: null }),
            single: () => ({ data: null, error: null })
          }),
          order: () => ({ data: [], error: null }),
          single: () => ({ data: null, error: null })
        }),
        order: () => ({ data: [], error: null })
      }),
      insert: () => ({ select: () => ({ data: [], error: null }) }),
      upsert: () => ({ select: () => ({ data: [], error: null }) }),
      delete: () => ({ eq: () => ({ data: [], error: null }) }),
      update: () => ({ eq: () => ({ data: [], error: null }) })
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        remove: () => ({ data: null, error: null })
      })
    }
  };
}

// Database operations for ARC site
window.supabaseArcOperations = {
  // Photos
  async getAllPhotos() {
    try {
      const { data, error } = await window.supabase
        .from('photo_gallery')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching photos:', error);
      return [];
    }
  },

  async savePhoto(photo) {
    try {
      const { data, error } = await window.supabase
        .from('photo_gallery')
        .insert(photo)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error saving photo:', error);
      throw error;
    }
  },

  async deletePhoto(id) {
    try {
      const { error } = await window.supabase
        .from('photo_gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.log('Error deleting photo:', error);
      throw error;
    }
  },

  // Image upload using Supabase Storage
  async uploadImage(file, fileName) {
    try {
      const { data, error } = await window.supabase.storage
        .from('photos')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = window.supabase.storage
        .from('photos')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.log('Error uploading image:', error);
      throw error;
    }
  },

  // Button Management (same as main site)
  async getActiveButtons() {
    try {
      const { data, error } = await window.supabase
        .from('dynamic_buttons')
        .select('*')
        .eq('hidden', false)
        .or(`is_temporary.eq.false,expiry_date.gte.${new Date().toISOString()}`)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching buttons:', error);
      return [];
    }
  },

  async getAllButtons() {
    try {
      const { data, error } = await window.supabase
        .from('dynamic_buttons')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching all buttons:', error);
      return [];
    }
  },

  async saveButton(button) {
    try {
      const { data, error } = await window.supabase
        .from('dynamic_buttons')
        .upsert(button)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error saving button:', error);
      throw error;
    }
  },

  async deleteButton(id) {
    try {
      const { error } = await window.supabase
        .from('dynamic_buttons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.log('Error deleting button:', error);
      throw error;
    }
  },

  async toggleButtonVisibility(id) {
    try {
      const { data: button, error: fetchError } = await window.supabase
        .from('dynamic_buttons')
        .select('hidden')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      const { error } = await window.supabase
        .from('dynamic_buttons')
        .update({ hidden: !button.hidden })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.log('Error toggling button visibility:', error);
      throw error;
    }
  },

  // News Management (same as main site)
  async getAllNews() {
    try {
      const { data, error } = await window.supabase
        .from('website_news')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.log('Error fetching news:', error);
      return [];
    }
  },

  async saveNews(news) {
    try {
      const { data, error } = await window.supabase
        .from('website_news')
        .insert(news)
        .select();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.log('Error saving news:', error);
      throw error;
    }
  },

  async deleteNews(id) {
    try {
      const { error } = await window.supabase
        .from('website_news')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.log('Error deleting news:', error);
      throw error;
    }
  }
};

console.log('Supabase operations for ARC site loaded');
