#include <gtk/gtk.h>

typedef struct {
  gchar *label;
} AppOptions;


void g_application_init_cmd_parameters(GApplication *app, AppOptions *options)
{
  const GOptionEntry cmd_params[] =
  {
    {
      .long_name = "label",
      .short_name = 'n',
      .flags = G_APPLICATION_DEFAULT_FLAGS, 
      .arg = G_OPTION_ARG_STRING,
      .arg_data = &(options->label),
      .description = "label to show",
      .arg_description = NULL,
    },
    {NULL}
  };
  g_application_add_main_option_entries (G_APPLICATION (app), cmd_params);
}



void init_application(GtkApplication *app, AppOptions *p_options)
{
  //window
  GtkWidget * window;

  GString * window_title = g_string_new("placeholder_");
  g_string_append(window_title, p_options->label);

  window = gtk_application_window_new (app);
  gtk_window_set_title (GTK_WINDOW (window), window_title->str);
  gtk_window_set_default_size (GTK_WINDOW (window), 250, 250);
  gtk_widget_set_opacity(window, 0.2);


  //label
  GtkWidget * label = gtk_label_new (p_options->label);
 
  PangoAttrList * attrlist = pango_attr_list_new();
  PangoFontDescription * font_desc = pango_font_description_new();
  pango_font_description_set_size(font_desc, 70 * PANGO_SCALE);
  pango_font_description_set_weight(font_desc, PANGO_WEIGHT_HEAVY);
  PangoAttribute * attr = pango_attr_font_desc_new(font_desc);

  pango_attr_list_insert(attrlist, attr);
  gtk_label_set_attributes(GTK_LABEL (label), attrlist);

  gtk_widget_set_halign (label, GTK_ALIGN_CENTER);
  gtk_widget_set_valign (label, GTK_ALIGN_CENTER);

  gtk_window_set_child (GTK_WINDOW (window), label);


  //present
  gtk_window_present(GTK_WINDOW (window));
}


static AppOptions app_options;

int main(int argc, char *argv[]) {

  int status;

  GtkApplication * app = gtk_application_new (NULL, G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect (app, "activate", G_CALLBACK (init_application), &app_options);
  
  g_application_init_cmd_parameters (G_APPLICATION (app), &app_options);

  status = g_application_run (G_APPLICATION (app), argc, argv);
  g_object_unref (app);
  return status;

}
