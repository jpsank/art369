import pandas as pd
import numpy as np
from PIL import Image
import jinja2
import os
from wordcloud import WordCloud, STOPWORDS, ImageColorGenerator

# Read excel files
bars_df = pd.read_excel('bars.xlsx', sheet_name='Bars')
songs_df = pd.read_excel('bars.xlsx', sheet_name='Songs')

bars = bars_df.to_dict(orient='records')
songs = songs_df.to_dict(orient='records')
songs = {song['Id']: song for song in songs}

# Generate wordcloud
stopwords = set(STOPWORDS) | {'chorus', 'verse', 'nigga', 'niggas'} | {'shit', 'fuck', 'bitch', 'ass'} | {'got', 'yeah', 'know', 'go', 'way', 'show', 'see', 'let', 'need'}

mask = np.array(Image.open("mic.png").convert("RGBA"))
mask[mask[:, :, 3] == 0] = [255, 255, 255, 255]
image_colors = ImageColorGenerator(mask)

wc = WordCloud(stopwords=stopwords, background_color='white', mask=mask, max_words=2000, color_func=image_colors)
all_lyrics = ' '.join([song['Full lyrics'] for song in songs.values()])
wc.generate(all_lyrics)

wc.to_file('frontend/wordcloud.png')

# Generate HTML pages for each bar
template = jinja2.Template(open('template.html').read())

for bar in bars:
    song = songs[bar['Song Id']]
    with open(f'frontend/{bar["Id"]}.html', 'w') as f:
        f.write(template.render(bar=bar, songs=songs, song=song))

# Index
with open('frontend/index.html', 'w') as f:
    words = [{"word": word, "size": int(size*100)} for word, size in wc.words_.items() if int(size*100) > 0]
    f.write(template.render(bars=bars_df.to_dict(orient='records'), songs=songs_df.to_dict(orient='records'), words=words))
